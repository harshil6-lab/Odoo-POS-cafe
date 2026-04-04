import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { staffRoles } from '../data/restaurantData';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function Login() {
  const navigate = useNavigate();
  const { user, login, redirectPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'waiter' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [authLoading, navigate, redirectPath, user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(form);
      navigate(result.redirectTo, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to open the staff workspace"
      description="Use a mock staff account to access dashboard, register, tables, and kitchen workflows."
      panelTitle="Cafe service flow"
      panelDescription="This frontend-only demo uses local mock staff access for waiter, cashier, and manager roles."
      panelPoints={[
        'Pick a role and enter the dashboard without backend setup.',
        'Move between tables, register, kitchen, and reports in one interface.',
        'Use this flow for frontend demos and hackathon judging.',
      ]}
      footer={(
        <>
          Need an account?{' '}
          <Link className="font-semibold text-amber-400" to="/signup">
            Create one here
          </Link>
        </>
      )}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Email
          <Input
            type="email"
            name="email"
            placeholder="customer@possuite.com"
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

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Staff role
          <select name="role" value={form.role} onChange={handleChange} className="h-11 rounded-2xl border border-white/10 bg-[#0B1220] px-3.5 text-sm text-slate-100">
            {staffRoles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </label>

        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="h-12 w-full text-sm" disabled={loading}>
          {loading ? 'Signing you in...' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;