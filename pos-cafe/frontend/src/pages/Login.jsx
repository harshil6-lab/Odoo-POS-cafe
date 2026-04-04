import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function Login() {
  const navigate = useNavigate();
  const { user, login, redirectPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4 py-10">
      <div className="w-full max-w-[420px] rounded-xl border border-[#374151] bg-[#111827] p-8 shadow-md">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Sign in</h1>
          <p className="text-sm text-[#9CA3AF]">
            Sign in with your real Supabase staff account. Access is limited to manager, waiter, and cashier roles.
          </p>
          <p className="rounded-xl border border-[#374151] bg-[#0B1220] px-4 py-3 text-sm text-[#9CA3AF]">
            Only staff accounts with an assigned role can access this app.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-[#F9FAFB]">
            Email
            <Input
              type="email"
              name="email"
              placeholder="staff@restaurant.com"
              value={form.email}
              onChange={handleChange}
              required
              className="h-11 rounded-xl border-[#374151] bg-[#0B1220] text-[#F9FAFB] placeholder:text-[#9CA3AF]"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#F9FAFB]">
            Password
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="h-11 rounded-xl border-[#374151] bg-[#0B1220] text-[#F9FAFB] placeholder:text-[#9CA3AF]"
            />
          </label>

          {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="h-11 w-full rounded-xl border border-[#F59E0B] bg-[#F59E0B] text-sm text-[#0B1220] hover:bg-[#D97706]" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-[#9CA3AF]">
          Need an account?{' '}
          <Link className="font-medium text-[#F59E0B] hover:text-[#D97706]" to="/signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;