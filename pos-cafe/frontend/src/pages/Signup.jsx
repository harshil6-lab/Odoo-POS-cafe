import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

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
      await signUp(form);
      setSuccess('Account created. Verify the email if confirmation is enabled in Supabase, then sign in.');
      setForm({ fullName: '', email: '', password: '' });
    } catch (err) {
      setError(err.message ?? 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-6 sm:p-10">
      <div className="panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.95fr,1.05fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-300">Launch crew</p>
          <h1 className="mt-5 text-4xl font-bold">Create the first restaurant operator account.</h1>
          <p className="mt-4 text-sm text-slate-300">
            Staff accounts can be created from Supabase Auth or this onboarding screen during the hackathon setup.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Get started</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Create account</h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                className="input mt-2"
                type="text"
                name="fullName"
                placeholder="Aarav Mehta"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                className="input mt-2"
                type="email"
                name="email"
                placeholder="cashier@poscafe.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                className="input mt-2"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                minLength={6}
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            {success ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link className="font-semibold text-brand-600" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;