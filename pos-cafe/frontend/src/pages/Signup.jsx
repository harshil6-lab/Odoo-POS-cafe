import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function Signup() {
  const navigate = useNavigate();
  const { user, signup, redirectPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
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

      setSuccess('Account created. If email confirmation is enabled, verify it. A manager must assign your staff role before you can sign in.');
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
      title="Create a staff account"
      description="Create a real Supabase Auth account for the restaurant workspace. Staff access starts after a manager assigns your role."
      panelTitle="Restaurant friendly design"
      panelDescription="Every signup creates a real auth user and a matching public.users profile. Roles are assigned separately for production-style staff access control."
      panelPoints={[
        'Signups create a real auth.users account and linked public.users profile.',
        'Managers assign the final role from the roles table after account creation.',
        'Users without a role are blocked from the staff workspace.',
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