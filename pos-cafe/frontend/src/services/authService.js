import { supabase } from './supabaseClient';

const AUTH_RATE_LIMIT_MS = 60 * 1000;

function getCooldownKey(action) {
  return `pos-cafe-auth-cooldown:${action}`;
}

function getCooldownRemaining(action) {
  if (typeof window === 'undefined') {
    return 0;
  }

  const storedUntil = Number(window.localStorage.getItem(getCooldownKey(action)) || 0);
  if (!storedUntil || Number.isNaN(storedUntil)) {
    return 0;
  }

  const remaining = storedUntil - Date.now();
  if (remaining <= 0) {
    window.localStorage.removeItem(getCooldownKey(action));
    return 0;
  }

  return remaining;
}

function setCooldown(action, durationMs = AUTH_RATE_LIMIT_MS) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getCooldownKey(action), String(Date.now() + durationMs));
}

function formatSeconds(milliseconds) {
  return Math.max(1, Math.ceil(milliseconds / 1000));
}

function normalizeAuthError(error, action) {
  const rawMessage = String(error?.message || '').toLowerCase();
  const normalizedError = new Error(error?.message || 'Authentication failed.');
  normalizedError.status = error?.status;

  if (error?.status === 429 || rawMessage.includes('rate limit')) {
    setCooldown(action);
    const remaining = getCooldownRemaining(action) || AUTH_RATE_LIMIT_MS;
    normalizedError.message = `Too many ${action} attempts for this Supabase project. Please wait ${formatSeconds(remaining)} seconds and try again.`;
    return normalizedError;
  }

  if (rawMessage.includes('invalid login credentials')) {
    normalizedError.message = 'Incorrect email or password. Check your details and try again.';
    return normalizedError;
  }

  if (rawMessage.includes('email not confirmed')) {
    normalizedError.message = 'Please confirm your email before logging in.';
    return normalizedError;
  }

  if (rawMessage.includes('user already registered')) {
    normalizedError.message = 'This email is already registered. Try logging in instead.';
    return normalizedError;
  }

  if (rawMessage.includes('password should be at least')) {
    normalizedError.message = 'Password must be at least 6 characters long.';
    return normalizedError;
  }

  return normalizedError;
}

function throwIfCooldownActive(action) {
  const remaining = getCooldownRemaining(action);
  if (!remaining) {
    return;
  }

  throw new Error(`Please wait ${formatSeconds(remaining)} seconds before trying to ${action} again.`);
}

export const authService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async getUserRole(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Role fetch error:', error);
      return null;
    }

    return data?.role ?? null;
  },

  async getRoleProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        created_at,
        role
      `)
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
      full_name: data.full_name || null,
      email: data.email,
      created_at: data.created_at,
      role: String(data.role || '').toLowerCase(),
    };
  },

  async signIn({ email, password }) {
    throwIfCooldownActive('login');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw normalizeAuthError(error, 'login');
    }

    return data;
  },

  async signUp({ email, password, fullName, phone }) {
    throwIfCooldownActive('signup');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
          phone,
        },
      },
    });

    if (error) {
      throw normalizeAuthError(error, 'signup');
    }

    const identities = data?.user?.identities ?? [];
    if (data?.user && Array.isArray(identities) && identities.length === 0) {
      throw new Error('This email is already registered. Try logging in instead.');
    }

    return {
      ...data,
      profile: data.user
        ? {
            id: data.user.id,
            full_name: fullName || null,
            email,
            phone,
            role: null,
          }
        : null,
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },
};