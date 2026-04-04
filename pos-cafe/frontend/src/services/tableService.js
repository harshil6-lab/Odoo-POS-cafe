import { supabase } from './supabaseClient';

const TABLE_STATUSES = new Set(['available', 'occupied', 'reserved', 'cleaning']);
const tableSelect = 'id, name, area, capacity, pos_x, pos_y, shape, status, active';

function mapTableRecord(record) {
  const area = record.area ?? 'Main';

  return {
    id: record.name,
    dbId: record.id,
    tableCode: record.name,
    label: `Table ${record.name}`,
    floor: area,
    zone: area,
    status: record.status,
    seats: record.capacity,
    capacity: record.capacity,
    posX: record.pos_x,
    posY: record.pos_y,
    shape: record.shape,
    active: record.active,
    note: `${record.name} — ${area}, seats ${record.capacity}`,
  };
}

function resolveTableColumn(tableIdentifier) {
  return /^[0-9a-f-]{36}$/i.test(String(tableIdentifier)) ? 'id' : 'name';
}

function normalizeStatus(status) {
  const normalizedStatus = String(status || '').toLowerCase();

  if (!TABLE_STATUSES.has(normalizedStatus)) {
    throw new Error('Invalid table status.');
  }

  return normalizedStatus;
}

export async function getAllTables() {
  const { data, error } = await supabase.from('tables').select(tableSelect).order('name');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTableRecord);
}

export async function getTablesByArea(area) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('area', area)
    .order('name');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTableRecord);
}

export async function getTableByCode(tableName) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('name', tableName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapTableRecord(data) : null;
}

export async function updateTableStatus(tableIdentifier, status) {
  const nextStatus = normalizeStatus(status);
  const column = resolveTableColumn(tableIdentifier);
  const { data, error } = await supabase
    .from('tables')
    .update({ status: nextStatus })
    .eq(column, tableIdentifier)
    .select(tableSelect)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Missing record');
  }

  return mapTableRecord(data);
}

export const getTables = getAllTables;