import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { staffRoles } from '../data/restaurantData';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function Signup() {
  const navigate = useNavigate();
  const { user, signup, redirectPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', role: 'waiter' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      const result = await signup(form);
      if (result.redirectTo) {
        navigate(result.redirectTo, { replace: true });
        return;
      }

      setSuccess('Account created. Verify the email if confirmation is enabled in Supabase, then sign in.');
      setForm({ fullName: '', phone: '', email: '', password: '' });
    } catch (err) {
      setError(err.message ?? 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Create a mock staff account"
      description="Use frontend-only mock signup to preview the dashboard workflow for different staff roles."
      panelTitle="Restaurant friendly design"
      panelDescription="This signup flow stores a local mock staff profile so you can test the full cafe suite without backend work."
      panelPoints={[
        'Create a waiter, cashier, or manager profile in one step.',
        'Move straight into dashboard, register, kitchen, and floor layout screens.',
        'Keep the whole demo frontend-only and easy to reset.',
      ]}
      footer={(
        <>
          Already have an account?{' '}
          <Link className="font-semibold text-amber-400" to="/login">
            Log in here
          </Link>
        </>
      )}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Full name
          <Input
            type="text"
            name="fullName"
            placeholder="Priya Shah"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Phone number
          <Input
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

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
            placeholder="Minimum 6 characters"
            minLength={6}
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
        {success ? <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</p> : null}

        <Button type="submit" className="h-12 w-full text-sm" disabled={loading}>
          {loading ? 'Creating your account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Signup;