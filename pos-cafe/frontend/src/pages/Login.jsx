import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../services/supabaseClient';
import AuthLayout from '../layouts/AuthLayout';

function Login() {
  const navigate = useNavigate();
  const { fetchUserRole } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      if (sessionStorage.getItem("table_code"))
        return;

      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error || !session)
        return;
    };

    checkSession();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setError('Login failed: No user data returned.');
        setLoading(false);
        return;
      }

      // CRITICAL: Fetch role IMMEDIATELY after login
      // This determines where the user is redirected
      const userRole = await fetchUserRole(data.user.id);

      if (!userRole) {
        // User logged in but has no staff role
        await supabase.auth.signOut();
        setError('Your account does not have a staff role assigned. Contact your manager.');
        setLoading(false);
        return;
      }

      // Log successful role fetch for debugging
      console.log(`User ${data.user.email} logged in with role: ${userRole}`);

      // Redirect based on role
      const redirectMap = {
        manager: '/dashboard',
        waiter: '/tables',
        cashier: '/billing',
        chef: '/kitchen',
      };

      const redirectPath = redirectMap[userRole] || '/login';
      navigate(redirectPath, { replace: true });

      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message ?? 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Staff login"
      title="Sign in to your workspace"
      description="Sign in with your Supabase staff account. Access is limited to manager, waiter, cashier, and chef roles."
      panelTitle="Welcome back"
      panelDescription="Your restaurant workspace is one login away."
      panelPoints={[
        'Only staff accounts with an assigned role can access this app.',
        'Customers order by scanning a table QR code — no login needed.',
        'Contact a manager if you need a role assigned to your account.',
      ]}
      footer={(
        <>
          Need an account?{' '}
          <Link className="font-semibold text-primary hover:text-primary/80" to="/signup">
            Create account
          </Link>
        </>
      )}
    >
      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Email
          <Input
            type="email"
            name="email"
            placeholder="staff@restaurant.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Password
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="h-12 w-full text-sm" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;