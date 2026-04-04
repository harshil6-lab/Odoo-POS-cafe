import { createContext, useContext, useEffect, useState } from 'react';
import { getRedirectPathForRole, getRoleBadgeLabel, normalizeRole } from '../utils/roleNavigation';

const AuthContext = createContext(null);
const STORAGE_KEY = 'pos-cafe-mock-staff-session';

function readStoredStaff() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function writeStoredStaff(value) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!value) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStaff = readStoredStaff();

    if (storedStaff) {
      setSession({ user: storedStaff });
      setUser(storedStaff);
      setProfile(storedStaff);
      setRole(normalizeRole(storedStaff.role));
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Enter email and password to continue.');
    }

    const nextRole = normalizeRole(credentials.role || 'waiter');
    const nextUser = {
      id: `staff-${Date.now()}`,
      email: credentials.email,
      full_name: credentials.fullName || credentials.email.split('@')[0],
      role: nextRole,
    };

    writeStoredStaff(nextUser);
    setSession({ user: nextUser });
    setUser(nextUser);
    setProfile(nextUser);
    setRole(nextRole);

    return {
      data: { user: nextUser },
      redirectTo: '/dashboard',
    };
  };

  const signup = async (payload) => {
    if (!payload.fullName || !payload.email || !payload.password) {
      throw new Error('Complete the form before creating the account.');
    }

    const nextRole = normalizeRole(payload.role || 'waiter');
    const nextUser = {
      id: `staff-${Date.now()}`,
      email: payload.email,
      full_name: payload.fullName,
      phone: payload.phone,
      role: nextRole,
    };

    writeStoredStaff(nextUser);
    setSession({ user: nextUser });
    setUser(nextUser);
    setProfile(nextUser);
    setRole(nextRole);

    return {
      data: { user: nextUser },
      redirectTo: '/dashboard',
    };
  };

  const logout = async () => {
    writeStoredStaff(null);
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