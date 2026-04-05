import { createServiceClient, supabase } from './supabaseClient.js';
import { getRedirectPathForRole, getUserProfile, isStaffRole, normalizeRole } from './roleService.js';

function validateStaffRole(role) {
  const normalizedRole = normalizeRole(role);
  if (
    normalizedRole !== "manager" &&
    normalizedRole !== "waiter" &&
    normalizedRole !== "cashier" &&
    normalizedRole !== "chef"
  ) {
    throw new Error("Invalid staff role.");
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
  if (!profile || !["manager","waiter","cashier","chef"].includes(profile.role)) {
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
  const { data, error } = await serviceClient
    .from("users")
    .update({
      role: normalizedRole,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return {
    ...data,
    role: normalizedRole,
    redirectTo: getRedirectPathForRole(normalizedRole),
  };
}

export async function signOutStaff() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}