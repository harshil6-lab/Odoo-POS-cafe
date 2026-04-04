import { createServiceClient, supabase } from './supabaseClient.js';
import { getRedirectPathForRole, getUserProfile, isStaffRole, normalizeRole } from './roleService.js';

function validateStaffRole(role) {
  const normalizedRole = normalizeRole(role);

  if (!isStaffRole(normalizedRole)) {
    throw new Error('Only manager, waiter, and cashier accounts are allowed.');
  }

  return normalizedRole;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInStaff({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  const profile = await getUserProfile(data.user.id);

  if (!profile || !isStaffRole(profile.role)) {
    await supabase.auth.signOut();
    throw new Error('This account does not have staff access.');
  }

  return {
    ...data,
    profile,
    redirectTo: getRedirectPathForRole(profile.role),
  };
}

export async function signUpStaff({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    ...data,
    profile: data.user
      ? {
          id: data.user.id,
          full_name: fullName || null,
          email,
          role: null,
        }
      : null,
    redirectTo: null,
  };
}

export async function assignRoleToUser(userId, roleName) {
  const normalizedRole = validateStaffRole(roleName);
  const serviceClient = createServiceClient();

  const { data: roleRecord, error: roleError } = await serviceClient
    .from('roles')
    .select('id, name')
    .eq('name', normalizedRole)
    .maybeSingle();

  if (roleError) {
    throw roleError;
  }

  if (!roleRecord) {
    throw new Error(`Role ${normalizedRole} does not exist.`);
  }

  const { data: updatedUser, error: updateError } = await serviceClient
    .from('users')
    .update({ role_id: roleRecord.id, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id, full_name, email, created_at, role:roles(id, name)')
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    id: updatedUser.id,
    full_name: updatedUser.full_name,
    email: updatedUser.email,
    created_at: updatedUser.created_at,
    role: normalizeRole(updatedUser.role?.name),
    role_id: updatedUser.role?.id ?? null,
    redirectTo: getRedirectPathForRole(updatedUser.role?.name),
  };
}

export async function signOutStaff() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}