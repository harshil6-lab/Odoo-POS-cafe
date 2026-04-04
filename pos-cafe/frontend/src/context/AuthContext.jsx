import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { getRedirectPathForRole, getRoleBadgeLabel } from '../utils/roleNavigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        roles (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Role fetch failed:', error);
      return null;
    }

    return data?.roles?.name ?? null;
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setLoading(false);
        return;
      }

      const role = await fetchUserRole(data.session.user.id);

      setSession(data.session);
      setUser(data.session.user);
      setRole(role);
      setLoading(false);

      if (!role) return;

      if (role === 'manager') navigate('/dashboard');
      if (role === 'waiter') navigate('/register');
      if (role === 'cashier') navigate('/billing');
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!nextSession?.user) {
        setSession(null);
        setUser(null);
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const role = await fetchUserRole(nextSession.user.id);
      setSession(nextSession);
      setUser(nextSession.user);
      setRole(role);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Enter email and password to continue.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);

    const role = await fetchUserRole(data.user.id);

    console.log('Fetched role:', role);

    if (!role) {
      await supabase.auth.signOut();
      throw new Error('Only staff accounts can access this app.');
    }

    setSession(data.session);
    setUser(data.user);
    setRole(role);

    return { redirectTo: role === 'manager' ? '/dashboard' : role === 'waiter' ? '/register' : '/billing' };
  };

  const signup = async (payload) => {
    if (!payload.email || !payload.password) {
      throw new Error('Complete the form before creating the account.');
    }

    const result = await authService.signUp(payload);

    if (result.session) {
      await authService.signOut();
    }

    return {
      data: result,
      redirectTo: null,
    };
  };

  const logout = async () => {
    await authService.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const displayName = profile?.full_name || user?.full_name || user?.email || 'Restaurant user';
  const roleBadge = role ? getRoleBadgeLabel(role) : null;

  const value = {
    session,
    user,
    profile,
    role,
    roleBadge,
    displayName,
    redirectPath: getRedirectPathForRole(role),
    isAuthenticated: Boolean(user),
    loading,
    login,
    signup,
    logout,
    fetchUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}