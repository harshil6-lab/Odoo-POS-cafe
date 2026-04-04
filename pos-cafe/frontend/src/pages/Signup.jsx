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
      // Validate role is selected
      if (!form.role || !STAFF_ROLES.includes(form.role)) {
        throw new Error('Please select a valid role: ' + STAFF_ROLES.join(', '));
      }

      const result = await signup(form);
      const authUser = result.data?.user;

      if (!authUser) {
        throw new Error('Signup failed: No user created.');
      }

      // CRITICAL: Insert into public.users with selected role IMMEDIATELY after signup
      // This determines the user's staff workspace access
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: form.fullName || 'Staff Member',
          role: form.role,  // Direct role assignment (no roles table join needed)
        })
        .select('id, email, role, full_name')
        .limit(1)
        .maybeSingle();

      if (insertError) {
        // If user insert fails, the system will fall back to DB 'cashier' default
        // This is a critical error that must be surfaced
        await supabase.auth.signOut();
        throw new Error('Failed to create staff profile: ' + insertError.message);
      }

      if (!insertedUser) {
        await supabase.auth.signOut();
        throw new Error('Staff profile was not created.');
      }

      // Verify role was saved correctly
      if (insertedUser.role !== form.role) {
        console.warn(
          `Role mismatch after insert: expected ${form.role}, got ${insertedUser.role}`
        );
      }

      setSuccess('Staff account created! You can now sign in with your credentials.');
      setForm({ fullName: '', phone: '', email: '', password: '', role: 'waiter' });

      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
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
            name="role"
            value={form.role}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-surface px-4 text-sm text-white focus:border-primary/50 focus:outline-none"
          >
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
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