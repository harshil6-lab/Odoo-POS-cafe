import { supabase } from './supabaseClient';

const TABLE_STATUSES = new Set(['available', 'occupied', 'reserved', 'cleaning']);
const tableSelect = 'id, table_code, seats, status';

function mapTableRecord(record) {
  return {
    id: record.table_code,
    dbId: record.id,
    tableCode: record.table_code,
    label: `Table ${record.table_code}`,
    floor: 'Main',
    zone: 'Main',
    status: record.status,
    seats: record.seats,
    capacity: record.seats,
    posX: null,
    posY: null,
    shape: 'square',
    active: true,
    note: `${record.table_code} — seats ${record.seats}`,
  };
}

function resolveTableColumn(tableIdentifier) {
  return /^[0-9a-f-]{36}$/i.test(String(tableIdentifier)) ? 'id' : 'table_code';
}

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

  return (data ?? []).map(mapTableRecord);
}

export async function getTablesByArea(area) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .order('table_code');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTableRecord);
}

export async function getTableByCode(tableName) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('table_code', tableName)
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