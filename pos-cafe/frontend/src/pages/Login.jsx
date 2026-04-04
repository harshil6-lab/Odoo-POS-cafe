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
      // QR customers should not see the staff login page
      if (sessionStorage.getItem('table_code')) {
        navigate('/menu');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const role = await fetchUserRole(data.session.user.id);
      if (!role) return;

      if (role === 'manager') navigate('/dashboard');
      else if (role === 'waiter') navigate('/register');
      else if (role === 'cashier') navigate('/billing');
      else if (role === 'chef') navigate('/kitchen');
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

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const role = await fetchUserRole(data.user.id);

    console.log('Fetched role:', role);

    if (!role) {
      setError('Only staff accounts can access this app.');
      setLoading(false);
      return;
    }

    if (role === 'manager') navigate('/dashboard');
    else if (role === 'waiter') navigate('/register');
    else if (role === 'cashier') navigate('/billing');
    else if (role === 'chef') navigate('/kitchen');
    else navigate('/menu');

    setLoading(false);
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
          <Link className="font-semibold text-amber-400" to="/signup">
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