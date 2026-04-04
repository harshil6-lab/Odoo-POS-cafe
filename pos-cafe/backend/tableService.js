import { supabase } from './supabaseClient.js';

const TABLE_STATUSES = new Set(['available', 'occupied', 'reserved', 'cleaning']);
const tableSelect = 'id, table_code, floor_id, status, seats, floor:floors(id, name)';

function normalizeStatus(status) {
  const normalizedStatus = String(status || '').toLowerCase();

  if (!TABLE_STATUSES.has(normalizedStatus)) {
    throw new Error('Invalid table status.');
  }

  return normalizedStatus;
}

export async function getAllTables() {
  const { data, error } = await supabase.from('tables').select(tableSelect).order('table_code');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getTablesByFloor(floorId) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('floor_id', floorId)
    .order('table_code');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getTableByCode(table_code) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('table_code', table_code)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTableStatus(table_id, status) {
  const nextStatus = normalizeStatus(status);
  const { data, error } = await supabase
    .from('tables')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', table_id)
    .select(tableSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export const getTables = getAllTables;