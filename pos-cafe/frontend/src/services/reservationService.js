import { supabase } from './supabaseClient';

const reservationSelect = 'id, customer_name, guests, reservation_time, table:tables(id, table_code, floor:floors(name))';

function mapReservation(record) {
  const reservationDate = new Date(record.reservation_time);

  return {
    id: record.id,
    tableId: record.table?.table_code ?? '',
    tableDbId: record.table?.id ?? null,
    name: record.customer_name,
    guests: record.guests,
    date: reservationDate.toISOString().slice(0, 10),
    time: reservationDate.toISOString().slice(11, 16),
    reservationTime: record.reservation_time,
    floor: record.table?.floor?.name ?? null,
  };
}

export async function createReservation(payload) {
  const { data, error } = await supabase.from('reservations').insert([payload]).select(reservationSelect).single();

  if (error) {
    throw error;
  }

  return mapReservation(data);
}

export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(reservationSelect)
    .order('reservation_time', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapReservation);
}