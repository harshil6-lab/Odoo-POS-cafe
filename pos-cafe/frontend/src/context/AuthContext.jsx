import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { getRedirectPathForRole, getRoleBadgeLabel } from '../utils/roleNavigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return data.role ?? null;
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setLoading(false);
        return;
      }

      // Validate the refresh token is still usable — prevents "Invalid Refresh Token" loop
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.warn('Stale session cleared:', refreshError.message);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const role = await fetchUserRole(session.user.id);

      setSession(session);
      setUser(session.user);
      setRole(role);
      setLoading(false);

      // QR customers have a table_code in sessionStorage — skip staff redirect
      if (sessionStorage.getItem('table_code')) return;

      // Login page handles its own redirect after credentials are entered
      if (location.pathname === '/login') return;

      if (!role) return;

      if (role === 'manager') navigate('/dashboard');
      else if (role === 'waiter') navigate('/register');
      else if (role === 'cashier') navigate('/billing');
      else if (role === 'chef') navigate('/kitchen');
      else navigate('/menu');
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      // Stale token — clean up instead of looping
      if (event === 'TOKEN_REFRESHED' && !nextSession) {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

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

    const redirectMap = { manager: '/dashboard', waiter: '/register', cashier: '/billing', chef: '/kitchen' };
    return { redirectTo: redirectMap[role] || '/menu' };
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};