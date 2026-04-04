import { mockTeamMembers } from '../utils/mockData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const demoSession = {
  user: {
    id: 'demo-manager',
    email: mockTeamMembers[0].email,
    user_metadata: {
      full_name: mockTeamMembers[0].name,
      role: 'manager',
    },
  },
};

export const authService = {
  async getSession() {
    if (!isSupabaseConfigured) {
      return { session: demoSession };
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data;
  },

  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      return {
        session: {
          ...demoSession,
          user: {
            ...demoSession.user,
            email,
            user_metadata: {
              ...demoSession.user.user_metadata,
              full_name: email.split('@')[0],
            },
          },
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signUp({ email, password, fullName }) {
    if (!isSupabaseConfigured) {
      return {
        session: {
          ...demoSession,
          user: {
            id: `demo-${email}`,
            email,
            user_metadata: {
              full_name: fullName,
              role: 'manager',
            },
          },
        },
      };
    }

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

    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      callback('SIGNED_IN', demoSession);
      return {
        unsubscribe: () => {},
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return subscription;
  },
};