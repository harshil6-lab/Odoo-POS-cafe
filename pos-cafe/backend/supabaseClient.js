import { createClient } from '@supabase/supabase-js';

function readEnvironmentValue(...keys) {
  const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env ?? {} : {};
  const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};

  for (const key of keys) {
    if (viteEnv[key]) {
      return viteEnv[key];
    }

    if (processEnv[key]) {
      return processEnv[key];
    }
  }

  return undefined;
}

export const supabaseUrl = readEnvironmentValue('VITE_SUPABASE_URL', 'SUPABASE_URL');
export const supabaseAnonKey = readEnvironmentValue('VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');
export const supabaseServiceRoleKey = readEnvironmentValue('SUPABASE_SERVICE_ROLE_KEY');

function assertConfig(url, key, label) {
  if (!url || !key) {
    throw new Error(`Missing Supabase environment variables for ${label}.`);
  }
}

export function createSupabaseClient(key = supabaseAnonKey) {
  assertConfig(supabaseUrl, key, 'Supabase client');

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function createServiceClient() {
  assertConfig(supabaseUrl, supabaseServiceRoleKey, 'Supabase service client');

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = createSupabaseClient();