import { supabase } from './supabaseClient';

// Note: The reservations table may not exist in all deployments.
// Functions gracefully return empty data if the table is missing.

const reservationSelect = 'id, customer_name, guests, reservation_time, table_id, table:tables(id, name, area)';

function mapReservation(record) {
  const reservationDate = new Date(record.reservation_time);

  return {
    id: record.id,
    tableId: record.table?.name ?? '',
    tableDbId: record.table?.id ?? record.table_id ?? null,
    name: record.customer_name,
    guests: record.guests,
    date: reservationDate.toISOString().slice(0, 10),
    time: reservationDate.toISOString().slice(11, 16),
    reservationTime: record.reservation_time,
    floor: record.table?.area ?? null,
  };
}

export async function createReservation(payload) {
  const { data, error } = await supabase.from('reservations').insert([payload]).select(reservationSelect).limit(1).maybeSingle();

  if (error) {
    console.warn('Reservation insert failed (table may not exist):', error.message);
    throw error;
  }

  if (!data) {
    throw new Error('Missing record');
  }

  return mapReservation(data);
}

export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(reservationSelect)
    .order('reservation_time', { ascending: true });

  if (error) {
    // Table may not exist — return empty gracefully
    console.warn('Reservations fetch failed (table may not exist):', error.message);
    return [];
  }

  return (data ?? []).map(mapReservation);
}