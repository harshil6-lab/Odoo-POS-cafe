import { supabase } from './supabaseClient';
import { calculateOrderTotals } from '../utils/helpers';

const orderSelect = `
  id,
  order_number,
  status,
  order_type,
  notes,
  customer_name,
  subtotal,
  tax_amount,
  service_charge,
  total_amount,
  created_at,
  updated_at,
  table:tables(id, name, area, status),
  cashier:users(id, full_name, email),
  items:order_items(
    id,
    quantity,
    unit_price,
    line_total,
    notes,
    product:products(id, name, sku, price)
  ),
  payments(id, method, amount, status, provider_reference, paid_at)
`;

export async function fetchTables() {
  const { data, error } = await supabase.from('tables').select('*').order('name');
  if (error) {
    throw error;
  }
  return data ?? [];
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order').order('name');
  if (error) {
    throw error;
  }
  return data ?? [];
}

export async function createCategory(payload) {
  const { data, error } = await supabase.from('categories').insert([payload]).select().single();
  if (error) {
    throw error;
  }
  return data;
}

export async function fetchProducts(categoryId) {
  let query = supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .eq('available', true)
    .order('name');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
}

export async function createProduct(payload) {
  const { data, error } = await supabase.from('products').insert([payload]).select().single();
  if (error) {
    throw error;
  }
  return data;
}

export async function fetchOrders(filters = {}) {
  let query = supabase.from('orders').select(orderSelect).order('created_at', { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.statuses?.length) {
    query = query.in('status', filters.statuses);
  }

  if (filters.tableId) {
    query = query.eq('table_id', filters.tableId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
}

export async function fetchPayments(limit = 100) {
  const { data, error } = await supabase
    .from('payments')
    .select('*, order:orders(id, order_number, total_amount)')
    .order('paid_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchDashboardSummary() {
  const [orders, tables, products, payments] = await Promise.all([
    fetchOrders({ limit: 200 }),
    fetchTables(),
    fetchProducts(),
    fetchPayments(200),
  ]);

  const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const activeTables = tables.filter((table) => table.status === 'occupied').length;
  const liveOrders = orders.filter((order) => ['pending', 'preparing', 'ready'].includes(order.status)).length;

  return {
    totalRevenue,
    activeTables,
    liveOrders,
    productsCount: products.length,
    recentOrders: orders.slice(0, 6),
  };
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select(orderSelect)
    .single();

  if (error) {
    throw error;
  }

  if (status === 'completed' && data?.table?.id) {
    await supabase.from('tables').update({ status: 'available' }).eq('id', data.table.id);
  }

  return data;
}

export async function createOrderWithItemsAndPayment({ order, items, payment }) {
  const totals = calculateOrderTotals(items);
  const orderPayload = {
    ...order,
    subtotal: totals.subtotal,
    tax_amount: totals.taxAmount,
    service_charge: totals.serviceCharge,
    total_amount: totals.total,
  };

  const { data: createdOrder, error: orderError } = await supabase
    .from('orders')
    .insert([orderPayload])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  if (items.length) {
    const itemPayload = items.map((item) => ({
      order_id: createdOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.quantity * item.unit_price,
      notes: item.notes ?? null,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemPayload);
    if (itemsError) {
      throw itemsError;
    }
  }

  if (payment) {
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        order_id: createdOrder.id,
        user_id: payment.user_id,
        method: payment.method,
        amount: payment.amount,
        provider_reference: payment.provider_reference ?? null,
        status: payment.status ?? 'completed',
      },
    ]);

    if (paymentError) {
      throw paymentError;
    }
  }

  if (createdOrder.table_id) {
    await supabase.from('tables').update({ status: 'occupied' }).eq('id', createdOrder.table_id);
  }

  return createdOrder;
}