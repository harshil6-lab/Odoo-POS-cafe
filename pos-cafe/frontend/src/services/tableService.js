import { supabase } from './supabaseClient';

const TABLE_STATUSES = new Set(['available', 'occupied', 'reserved', 'cleaning']);
const tableSelect = 'id, table_code, floor_id, status, seats, floor:floors(id, name)';

function buildNote(tableCode, floorName) {
  return floorName === 'Ground Floor'
    ? `${tableCode} is positioned close to the main service aisle.`
    : `${tableCode} is in the quieter upstairs seating area.`;
}

function mapTableRecord(record) {
  const floorName = record.floor?.name ?? 'Floor';

  return {
    id: record.table_code,
    dbId: record.id,
    floorId: record.floor_id ?? record.floor?.id ?? null,
    tableCode: record.table_code,
    label: `Table ${record.table_code}`,
    floor: floorName,
    zone: floorName,
    status: record.status,
    seats: record.seats,
    note: buildNote(record.table_code, floorName),
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

export async function getTablesByFloor(floorId) {
  const { data, error } = await supabase
    .from('tables')
    .select(tableSelect)
    .eq('floor_id', floorId)
    .order('table_code');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTableRecord);
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

  return data ? mapTableRecord(data) : null;
}

export async function updateTableStatus(tableIdentifier, status) {
  const nextStatus = normalizeStatus(status);
  const column = resolveTableColumn(tableIdentifier);
  const { data, error } = await supabase
    .from('tables')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq(column, tableIdentifier)
    .select(tableSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapTableRecord(data);
}

export const getTables = getAllTables;