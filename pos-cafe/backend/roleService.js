import { supabase } from './supabaseClient.js';

export const STAFF_ROLES = ['manager', 'waiter', 'cashier', 'chef'];

export function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

export function isStaffRole(role) {
  return STAFF_ROLES.includes(normalizeRole(role));
}

export function getRedirectPathForRole(role) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'manager') {
    return '/dashboard';
  }
  if (normalizedRole === 'chef') {
    return '/kitchen';
  }
  if (normalizedRole === 'waiter') {
    return '/tables';
  }
  if (normalizedRole === 'cashier') {
    return '/billing';
  }
  return '/login';
}

export async function getUserRole(userId) {
  const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });

  if (error) {
    throw error;
  }

  return normalizeRole(data);
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, created_at, role')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    created_at: data.created_at,
    role: normalizeRole(data.role),
  };
}