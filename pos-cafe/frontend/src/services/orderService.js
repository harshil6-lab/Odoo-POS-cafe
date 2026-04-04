import { buildCsv, calculateOrderTotals, cloneValue, formatCurrency } from '../utils/helpers';
import {
  mockCategories,
  mockOrders,
  mockPaymentAnalytics,
  mockProducts,
  mockRevenueTrend,
  mockSessions,
  mockTables,
} from '../utils/mockData';

let tablesStore = cloneValue(mockTables);
let ordersStore = cloneValue(mockOrders).map((order) => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    lineTotal: item.quantity * item.unitPrice,
  })),
}));

const emitOrdersUpdate = () => {
  window.dispatchEvent(new CustomEvent('orders:changed'));
  window.dispatchEvent(new CustomEvent('tables:changed'));
};

const enrichOrder = (order) => {
  const table = tablesStore.find((entry) => entry.id === order.tableId) ?? null;
  const categoryTotals = {};
  const items = order.items.map((item) => {
    const product = mockProducts.find((entry) => entry.id === item.productId) ?? null;
    const category = mockCategories.find((entry) => entry.id === product?.categoryId) ?? null;

    if (category) {
      categoryTotals[category.name] = (categoryTotals[category.name] ?? 0) + item.quantity * item.unitPrice;
    }

    return {
      ...item,
      product,
      category,
      lineTotal: item.lineTotal ?? item.quantity * item.unitPrice,
    };
  });
  const totals = calculateOrderTotals(items);

  return {
    ...order,
    table,
    items,
    totals,
    totalAmount: totals.total,
    subtotal: totals.subtotal,
    categoryTotals,
  };
};

export async function fetchTables() {
  return cloneValue(tablesStore);
}

export async function fetchOrders() {
  return cloneValue(ordersStore).map(enrichOrder).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function fetchDashboardSummary() {
  const orders = await fetchOrders();
  const tables = await fetchTables();
  const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const ordersToday = orders.length;
  const activeTables = tables.filter((table) => ['occupied', 'reserved'].includes(table.status)).length;
  const averageOrderValue = orders.length ? revenue / orders.length : 0;

  const categoryDistribution = mockCategories.map((category) => ({
    name: category.name,
    value: orders.reduce(
      (sum, order) => sum + order.items.filter((item) => item.category?.id === category.id).length,
      0,
    ),
    color: category.color,
  }));

  const recentActivity = orders.slice(0, 5).map((order) => ({
    id: order.id,
    title: `Order #${order.orderNumber}`,
    description: `${order.table?.name || 'Counter'} • ${order.items.length} items • ${order.status}`,
    timestamp: order.createdAt,
  }));

  return {
    revenue,
    ordersToday,
    activeTables,
    averageOrderValue,
    revenueTrend: mockRevenueTrend,
    categoryDistribution,
    recentActivity,
  };
}

export async function fetchReportsSummary() {
  const orders = await fetchOrders();
  const revenue = mockRevenueTrend;
  const categoryPie = mockCategories.map((category) => ({
    name: category.name,
    value: orders.reduce((sum, order) => sum + Number(order.categoryTotals[category.name] ?? 0), 0),
    color: category.color,
  }));

  const paymentAnalytics = mockPaymentAnalytics.map((entry) => ({
    ...entry,
    amount: orders
      .filter((order) => order.paymentMethod === entry.label.toLowerCase().replace(' ', '_'))
      .reduce((sum, order) => sum + order.totalAmount, 0),
  }));

  return {
    revenue,
    categoryPie,
    sessionAnalytics: mockSessions,
    paymentAnalytics,
  };
}

export async function createOrder(payload) {
  const nextOrderNumber = String(2400 + ordersStore.length + 1);
  const order = {
    id: `ord-${Date.now()}`,
    orderNumber: nextOrderNumber,
    tableId: payload.tableId || null,
    customerName: payload.customerName || 'Walk-in',
    status: payload.status || 'to-cook',
    diningStatus: payload.tableId ? 'occupied' : 'counter',
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentStatus ?? 'paid',
    notes: payload.notes || '',
    createdAt: new Date().toISOString(),
    items: payload.items.map((item) => ({
      id: `ord-item-${Date.now()}-${item.productId}`,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.quantity * item.unitPrice,
    })),
  };

  ordersStore = [order, ...ordersStore];

  if (payload.tableId) {
    tablesStore = tablesStore.map((table) =>
      table.id === payload.tableId ? { ...table, status: 'occupied' } : table,
    );
  }

  emitOrdersUpdate();
  return enrichOrder(order);
}

export async function updateOrderStatus(orderId, status) {
  ordersStore = ordersStore.map((order) => (order.id === orderId ? { ...order, status } : order));

  const nextOrder = ordersStore.find((order) => order.id === orderId);

  if (nextOrder?.tableId && status === 'completed') {
    tablesStore = tablesStore.map((table) =>
      table.id === nextOrder.tableId ? { ...table, status: 'available' } : table,
    );
  }

  emitOrdersUpdate();
  return enrichOrder(nextOrder);
}

export async function updateTableStatus(tableId, status) {
  tablesStore = tablesStore.map((table) => (table.id === tableId ? { ...table, status } : table));
  emitOrdersUpdate();
  return tablesStore.find((table) => table.id === tableId);
}

export async function exportOrders() {
  const orders = await fetchOrders();
  return buildCsv(
    orders.map((order) => ({
      orderNumber: order.orderNumber,
      table: order.table?.name || 'Counter',
      customer: order.customerName,
      status: order.status,
      paymentMethod: order.paymentMethod,
      total: formatCurrency(order.totalAmount),
    })),
  );
}

export function subscribeToOrders(callback) {
  const handler = () => callback();
  window.addEventListener('orders:changed', handler);
  return () => window.removeEventListener('orders:changed', handler);
}

export function subscribeToTables(callback) {
  const handler = () => callback();
  window.addEventListener('tables:changed', handler);
  return () => window.removeEventListener('tables:changed', handler);
}import { supabase } from './supabaseClient';
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