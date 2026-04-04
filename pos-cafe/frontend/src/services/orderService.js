import { supabase } from './supabaseClient';

const orderSelect = `
  id,
  customer_name,
  payment_method,
  status,
  created_at,
  table:tables(id, table_code, status, floor:floors(name)),
  items:order_items(
    id,
    quantity,
    preferences,
    menu_item:menu_items(id, name, price, image_url)
  )
`;

function titleCase(status) {
  const text = String(status || '').toLowerCase();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'Pending';
}

function mapOrder(order) {
  const items = (order.items ?? []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    preferences: item.preferences ?? {},
    name: item.menu_item?.name ?? 'Menu item',
    price: Number(item.menu_item?.price ?? 0),
    imageUrl: item.menu_item?.image_url ?? null,
  }));

  return {
    id: order.id,
    orderId: order.id,
    tableId: order.table?.table_code ?? null,
    tableDbId: order.table?.id ?? null,
    customer: {
      name: order.customer_name,
    },
    paymentMethod: order.payment_method,
    status: titleCase(order.status),
    createdAt: order.created_at,
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

async function getOrderById(orderId) {
  const { data, error } = await supabase.from('orders').select(orderSelect).eq('id', orderId).single();

  if (error) {
    throw error;
  }

  return mapOrder(data);
}

export async function createOrder(payload) {
  const { data, error } = await supabase.from('orders').insert([payload]).select('id').single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addOrderItems(orderId, items) {
  const rows = items.map((item) => ({
    order_id: orderId,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    preferences: item.preferences ?? {},
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

export async function createOrderWithItemsAndPayment({ order, items }) {
  const createdOrder = await createOrder(order);
  await addOrderItems(createdOrder.id, items);

  if (order.table_id) {
    await supabase.from('tables').update({ status: 'occupied', updated_at: new Date().toISOString() }).eq('id', order.table_id);
  }

  return getOrderById(createdOrder.id);
}

export async function updateOrderStatus(orderId, status) {
  const nextStatus = String(status || '').toLowerCase();
  const { error } = await supabase
    .from('orders')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    throw error;
  }

  return getOrderById(orderId);
}

export const fetchOrders = getOrders;