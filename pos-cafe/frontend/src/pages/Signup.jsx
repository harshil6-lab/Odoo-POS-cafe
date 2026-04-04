import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const STAFF_ROLES = ['manager', 'waiter', 'cashier', 'chef'];

function Signup() {
  const navigate = useNavigate();
  const { user, redirectPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('manager');
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
    if (loading) return;
    setLoading(true);
    setError('');
    setSuccess('');

    if (!selectedRole || !STAFF_ROLES.includes(selectedRole)) {
      setError('Please select a valid role: ' + STAFF_ROLES.join(', '));
      setLoading(false);
      return;
    }

    // Only create auth account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      setError('Signup succeeded but user ID missing.');
      setLoading(false);
      return;
    }

    // Upsert profile so role is stored immediately
    console.log('FINAL ROLE SENT:', selectedRole);
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email: form.email,
      full_name: form.fullName || 'Staff User',
      role: selectedRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('INSERT ERROR:', insertError.message);
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Sign out so user logs in fresh
    await supabase.auth.signOut();

    setSuccess('Account created! You can now sign in.');
    setForm({ fullName: '', phone: '', email: '', password: '' });
    setSelectedRole('manager');
    setLoading(false);

    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 2000);
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
        'Selected staff role is written directly to the public.users role field after account creation.',
        'Users without a role are blocked from the staff workspace.',
      ]}
      footer={(
        <>
          Already have an account?{' '}
          <Link className="font-semibold text-primary hover:text-primary/80" to="/login">
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
          Role
          <select
            value={selectedRole}
            onChange={(e) => {
              console.log('Selected role:', e.target.value);
              setSelectedRole(e.target.value);
            }}
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-surface px-4 text-sm text-white focus:border-primary/50 focus:outline-none"
          >
            <option value="manager">Manager</option>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
            <option value="cashier">Cashier</option>
          </select>
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