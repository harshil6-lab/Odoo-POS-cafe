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
    if (!userId) {
      console.warn('fetchUserRole called without userId');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, role, email, full_name')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Role fetch error:', error);
        return null;
      }

      // If no user profile exists, return null (user may not have staff role yet)
      if (!data) {
        console.warn(`No user profile found for ID: ${userId}`);
        return null;
      }

      // Validate role is a valid enum value
      const validRoles = ['admin', 'manager', 'cashier', 'kitchen', 'customer', 'waiter', 'chef'];
      const normalizedRole = (data.role || '').toLowerCase();
      
      if (!validRoles.includes(normalizedRole)) {
        console.warn(`Invalid role for user ${data.email}: ${data.role}`);
        return null;
      }

      return normalizedRole;
    } catch (err) {
      console.error('Unexpected error fetching role:', err);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (cancelled) return;

        if (sessionError || !session) {
          setLoading(false);
          return;
        }

        const role = await fetchUserRole(session.user.id);

        if (cancelled) return;

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
        else if (role === 'waiter') navigate('/tables');
        else if (role === 'cashier') navigate('/billing');
        else if (role === 'chef') navigate('/kitchen');
        else navigate('/menu');
      } catch (err) {
        if (!cancelled) {
          console.warn('Session restore error:', err.message);
          setLoading(false);
        }
      }
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (cancelled) return;

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
      cancelled = true;
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

    if (!data?.user) {
      throw new Error('Login failed: No user data returned.');
    }

    // CRITICAL: Fetch and validate role BEFORE updating context
    const role = await fetchUserRole(data.user.id);

    if (!role) {
      await supabase.auth.signOut();
      throw new Error('Your account does not have a staff role assigned. Contact your manager.');
    }

    setSession(data.session);
    setUser(data.user);
    setRole(role);

    // Calculate redirect path based on role
    const redirectMap = {
      manager: '/dashboard',
      waiter: '/tables',
      cashier: '/billing',
      chef: '/kitchen',
      admin: '/dashboard',
      kitchen: '/kitchen',  // Handle legacy 'kitchen' role
    };

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
    try {
      await authService.signOut();
    } finally {
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }

      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(null);
      navigate('/', { replace: true });
    }
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