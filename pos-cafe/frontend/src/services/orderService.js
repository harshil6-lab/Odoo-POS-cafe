import { supabase } from './supabaseClient';

const orderSelect = `
  id,
  table_id,
  customer_name,
  status,
  payment_status,
  payment_method,
  tax,
  service_charge,
  total,
  created_at,
  updated_at,
  table:tables(id, table_code, status),
  items:order_items!order_items_order_id_fkey(
    id,
    quantity,
    price,
    unit_price,
    line_total,
    notes,
    menu_item:menu_items(id, name, price, image_url)
  )
`;

function titleCase(status) {
  const text = String(status || '').toLowerCase();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'Pending';
}

function mapOrder(order) {
  const status = String(order.status || 'pending').toLowerCase();
  const items = (order.items ?? []).map((item) => ({
    id: item.id,
    quantity: Number(item.quantity),
    preferences: item.notes ? [item.notes] : [],
    name: item.menu_item?.name ?? 'Menu item',
    price: Number(item.unit_price ?? item.menu_item?.price ?? 0),
    imageUrl: item.menu_item?.image_url ?? null,
  }));

  const total = Number(order.total) || items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: order.id,
    orderId: order.id,
    tableId: order.table?.table_code ?? null,
    tableDbId: order.table?.id ?? order.table_id ?? null,
    customer: {
      name: order.customer_name || 'Guest',
    },
    paymentMethod: order.payment_method ?? null,
    paymentStatus: order.payment_status ?? null,
    status,
    statusLabel: titleCase(status),
    createdAt: order.created_at,
    items,
    tax: Number(order.tax) || 0,
    serviceCharge: Number(order.service_charge) || 0,
    total,
  };
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase.from('orders').select(orderSelect).eq('id', orderId).limit(1).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Missing record');
  }

  return mapOrder(data);
}

export async function createOrder(payload) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...payload, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Missing record');
  }

  return data;
}

export async function addOrderItems(orderId, items) {
  const rows = items.map((item) => ({
    order_id: orderId,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price: item.unit_price,
    unit_price: item.unit_price,
    line_total: item.unit_price * item.quantity,
    notes: (item.preferences ?? []).join(', ') || null,
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from('order_items').insert(rows).select('*');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getOrders(filters = {}) {
  let query = supabase.from('orders').select(orderSelect).order('created_at', { ascending: false });

  if (filters.statuses?.length) {
    query = query.in('status', filters.statuses.map((status) => String(status).toLowerCase()));
  }

  if (filters.tableId) {
    query = query.eq('table_id', filters.tableId);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function createOrderWithItemsAndPayment({ order, items, payment }) {
  // Calculate totals from items
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const taxAmount = subtotal * 0.08;
  const serviceCharge = subtotal * 0.02;
  const totalAmount = subtotal + taxAmount + serviceCharge;

  const orderPayload = {
    ...order,
    tax: parseFloat(taxAmount.toFixed(2)),
    service_charge: parseFloat(serviceCharge.toFixed(2)),
    total: parseFloat(totalAmount.toFixed(2)),
    payment_status: 'pending',
    payment_method: payment?.method || 'cash',
  };

  const createdOrder = await createOrder(orderPayload);
  await addOrderItems(createdOrder.id, items);

  if (order.table_id) {
    await supabase.from('tables').update({ status: 'occupied' }).eq('id', order.table_id);
  }

  return getOrderById(createdOrder.id);
}

export async function updateOrderStatus(orderId, status) {
  const nextStatus = String(status || '').toLowerCase();
  const { error } = await supabase
    .from('orders')
    .update({ status: nextStatus })
    .eq('id', orderId);

  if (error) {
    throw error;
  }

  return getOrderById(orderId);
}

export async function confirmPayment(orderId) {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'served' })
    .eq('id', orderId);

  if (error) {
    throw error;
  }

  return getOrderById(orderId);
}

export const fetchOrders = getOrders;