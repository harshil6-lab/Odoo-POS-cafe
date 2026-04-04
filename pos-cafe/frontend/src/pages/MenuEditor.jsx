import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function MenuEditor() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category_id: '', available: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('menu_items').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      category_id: form.category_id || null,
      available: form.available,
    };

    if (editing) {
      await supabase.from('menu_items').update(payload).eq('id', editing);
    } else {
      await supabase.from('menu_items').insert(payload);
    }

    setEditing(null);
    setForm({ name: '', price: '', category_id: '', available: true });
    fetchData();
  };

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      category_id: product.category_id || '',
      available: product.available,
    });
  };

  const toggleAvailability = async (product) => {
    await supabase.from('menu_items').update({ available: !product.available }).eq('id', product.id);
    fetchData();
  };

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-secondary">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-card p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-white">Menu Editor</h1>
        <p className="mt-1 text-sm text-text-secondary">Add, edit, or toggle availability of menu items.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-card p-4 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select
            className="rounded-lg border border-slate-800 bg-background px-3 py-2 text-sm text-white"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="bg-primary text-white">{editing ? 'Update' : 'Add'}</Button>
            {editing && (
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ name: '', price: '', category_id: '', available: true }); }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-card shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-text-secondary">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-white">{p.name}</td>
                <td className="px-4 py-3 text-text-secondary">{p.categories?.name || '—'}</td>
                <td className="px-4 py-3 text-white">₹{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.available ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {p.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="flex gap-2 px-4 py-3">
                  <Button variant="outline" className="text-xs" onClick={() => startEdit(p)}>Edit</Button>
                  <Button variant="outline" className="text-xs" onClick={() => toggleAvailability(p)}>
                    {p.available ? 'Disable' : 'Enable'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
