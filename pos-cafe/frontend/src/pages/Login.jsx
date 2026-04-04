import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      await signIn(form);
      navigate('/');
    } catch (err) {
      setError(err.message ?? 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[1.1fr,0.9fr]">
      <div className="hidden bg-hero-grid p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-600">POS Cafe</p>
          <h1 className="mt-6 max-w-lg text-5xl font-bold leading-tight text-slate-950">
            Run dining room, kitchen, and checkout from one realtime workspace.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Supabase powers secure authentication, live order sync, and an operational data model built for a restaurant floor.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {['Realtime kitchen tickets', 'Fast table turnover', 'Payment method tracking'].map((item) => (
            <div key={item} className="rounded-3xl border border-white/70 bg-white/70 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="panel w-full max-w-md p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Welcome back</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Sign in to the terminal</h2>
          <p className="mt-3 text-sm text-slate-500">Use a Supabase Auth account to access the restaurant dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                className="input mt-2"
                type="email"
                name="email"
                placeholder="owner@poscafe.com"
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Need an account?{' '}
            <Link className="font-semibold text-brand-600" to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;