import { supabase } from './supabaseClient.js';

const orderSelect = `
  id,
  customer_name,
  payment_method,
  status,
  created_at,
  table:tables(id, table_code, status, floor:floors(name)),
  items:order_items!order_items_order_id_fkey(
    id,
    quantity,
    preferences,
    menu_item:menu_items(id, name, price, image_url)
  )
`;

export async function createOrder(payload) {
  const { data, error } = await supabase.from('orders').insert([payload]).select(orderSelect).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addOrderItems(orderId, items) {
  const orderItemsPayload = items.map((item) => ({
    order_id: orderId,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    preferences: item.preferences ?? {},
  }));

  const { data, error } = await supabase.from('order_items').insert(orderItemsPayload).select('*');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getOrders(filters = {}) {
  let query = supabase.from('orders').select(orderSelect).order('created_at', { ascending: false });

  if (filters.statuses?.length) {
    query = query.in('status', filters.statuses);
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

  return data ?? [];
}