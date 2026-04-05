import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const STAFF_ROLES = ['manager', 'waiter', 'cashier', 'chef'];

export default function StaffManagement() {
  const { role } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load staff:', error);
      setLoading(false);
      return;
    }

    setStaff(
      (data || []).map((u) => ({
        ...u,
        _role: u.role || '',
        _dirty: false,
      }))
    );
    setLoading(false);
  };

  const handleRoleChange = (id, roleName) => {
    setStaff((prev) =>
      prev.map((u) => (u.id === id ? { ...u, _role: roleName, _dirty: true } : u))
    );
  };

  const handleSave = async (user) => {
    setSaving(user.id);

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: user._role })
        .eq('id', user.id);

      if (error) {
        alert('Update failed: ' + error.message);
        return;
      }

      setStaff((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, _dirty: false } : u))
      );
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete staff member "${user.full_name || user.email}"? This cannot be undone.`)) return;
    setSaving(user.id);
    try {
      const { error } = await supabase.from('users').delete().eq('id', user.id);
      if (error) {
        alert('Delete failed: ' + error.message);
        return;
      }
      setStaff((prev) => prev.filter((u) => u.id !== user.id));
    } finally {
      setSaving(null);
    }
  };

  if (role !== 'manager') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">
        Access denied — manager only
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Staff management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Assign roles and toggle active status for restaurant staff.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900">
              <tr>
                <th className="px-5 py-3 font-medium text-slate-400">Name</th>
                <th className="px-5 py-3 font-medium text-slate-400">Email</th>
                <th className="px-5 py-3 font-medium text-slate-400">Role</th>
                <th className="px-5 py-3 font-medium text-slate-400" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                    Loading staff...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                    No staff found.
                  </td>
                </tr>
              ) : (
                staff.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-800/60 transition hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-white">
                      {u.full_name || '—'}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-slate-300">
                      {u.email}
                    </td>

                    <td className="px-5 py-3">
                      <select
                        value={u._role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="" disabled>
                          Select role
                        </option>
                        {STAFF_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!u._dirty || saving === u.id}
                          onClick={() => handleSave(u)}
                          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                            u._dirty
                              ? 'bg-amber-500 text-black hover:bg-amber-400'
                              : 'cursor-default bg-slate-800 text-slate-500'
                          }`}
                        >
                          {saving === u.id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          disabled={saving === u.id}
                          onClick={() => handleDelete(u)}
                          className="rounded-lg bg-red-600/20 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-600/40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
