import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { getRedirectPathForRole, getRoleBadgeLabel, normalizeRole } from '../utils/roleNavigation';

const AuthContext = createContext(null);
const STAFF_ROLES = ['manager', 'waiter', 'cashier'];

function isStaffRole(role) {
  return STAFF_ROLES.includes(normalizeRole(role));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId) => {
    return authService.getUserRole(userId);
  };

  useEffect(() => {
    let mounted = true;

    const clearAuth = () => {
      if (!mounted) {
        return;
      }

      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(null);
    };

    const hydrateAuth = async (nextSession) => {
      if (!mounted) {
        return;
      }

      if (!nextSession?.user) {
        clearAuth();
        return;
      }

      try {
        const nextProfile = await authService.getRoleProfile(nextSession.user.id);

        if (!nextProfile || !isStaffRole(nextProfile.role)) {
          await authService.signOut();
          clearAuth();
          return;
        }

        if (!mounted) {
          return;
        }

        setSession(nextSession);
        setUser(nextSession.user);
        setProfile(nextProfile);
        setRole(normalizeRole(nextProfile.role));
      } catch {
        clearAuth();
      }
    };

    void authService
      .getSession()
      .then(({ session: currentSession }) => hydrateAuth(currentSession))
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, nextSession) => {
      void hydrateAuth(nextSession).finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Enter email and password to continue.');
    }

    const result = await authService.signIn(credentials);
    const nextRole = normalizeRole(result.profile?.role);

    setSession(result.session);
    setUser(result.user);
    setProfile(result.profile);
    setRole(nextRole);

    return {
      data: result,
      redirectTo: getRedirectPathForRole(nextRole),
    };
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