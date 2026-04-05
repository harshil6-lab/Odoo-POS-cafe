import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { getRedirectPathForRole, getRoleBadgeLabel } from '../utils/roleNavigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginInFlightRef = useRef(null);
  const pendingAuthProfileRef = useRef(null);

  const applyAuthState = (nextSession, nextProfile) => {
    const nextRole = nextProfile?.role ?? null;

    setSession(nextSession ?? null);
    setUser(nextSession?.user ?? null);
    setProfile(nextProfile ?? null);
    setRole(nextRole);
  };

  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const fetchUserProfile = async (userId) => {
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, role, email, full_name')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    const validRoles = ['admin', 'manager', 'cashier', 'kitchen', 'customer', 'waiter', 'chef'];
    const normalizedRole = String(data?.role || '').toLowerCase();

    if (!validRoles.includes(normalizedRole)) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: normalizedRole,
    };
  };

  const fetchUserRole = async (userId) => {
    try {
      const nextProfile = await fetchUserProfile(userId);
      return nextProfile?.role ?? null;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (cancelled) return;

      // Stale token — clean up instead of looping
      if (event === 'TOKEN_REFRESHED' && !nextSession) {
        await supabase.auth.signOut();
        pendingAuthProfileRef.current = null;
        clearAuthState();
        setLoading(false);
        return;
      }

      if (!nextSession?.user) {
        pendingAuthProfileRef.current = null;
        clearAuthState();
        setLoading(false);
        return;
      }

      try {
        const cachedProfile = pendingAuthProfileRef.current;
        const nextProfile = cachedProfile?.id === nextSession.user.id
          ? cachedProfile
          : await fetchUserProfile(nextSession.user.id).catch(() => null);

        pendingAuthProfileRef.current = null;
        applyAuthState(nextSession, nextProfile);
      } finally {
        setLoading(false);
      }
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

    if (loginInFlightRef.current) {
      return loginInFlightRef.current;
    }

    loginInFlightRef.current = (async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const nextUser = data?.user;

      if (!nextUser) {
        throw new Error('Login failed: No user data returned.');
      }

      const nextProfile = await fetchUserProfile(nextUser.id).catch(() => null);

      if (!nextProfile?.role) {
        await supabase.auth.signOut();
        throw new Error('User profile not found');
      }

      pendingAuthProfileRef.current = nextProfile;
      applyAuthState(data.session ?? null, nextProfile);

      const redirectMap = {
        manager: '/dashboard',
        chef: '/kitchen',
        waiter: '/tables',
        cashier: '/billing',
      };

      return { redirectTo: redirectMap[nextProfile.role] || '/login' };
    })();

    try {
      return await loginInFlightRef.current;
    } finally {
      loginInFlightRef.current = null;
    }
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