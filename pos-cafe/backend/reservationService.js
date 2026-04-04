import { supabase } from './supabaseClient.js';

const reservationSelect = 'id, customer_name, guests, reservation_time, table:tables(id, table_code, floor:floors(name))';

export async function createReservation(payload) {
  const { data, error } = await supabase.from('reservations').insert([payload]).select(reservationSelect).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(reservationSelect)
    .order('reservation_time', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}