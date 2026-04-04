import { useEffect, useState } from 'react';
import { createCategory, fetchCategories } from '../services/orderService';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError(err.message ?? 'Unable to load categories.');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createCategory({ ...form, sort_order: categories.length + 1 });
      setForm({ name: '', description: '' });
      await loadCategories();
    } catch (err) {
      setError(err.message ?? 'Unable to create category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr,1.25fr]">
      <form className="panel p-6" onSubmit={handleSubmit}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Catalog groups</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Create category</h2>

        <div className="mt-6 space-y-4">
          <input
            className="input"
            type="text"
            placeholder="Category name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <textarea
            className="input min-h-32 resize-none"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </div>

        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <button type="submit" className="btn-primary mt-6 w-full" disabled={saving}>
          {saving ? 'Saving category...' : 'Create category'}
        </button>
      </form>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Category</p>
            <h3 className="mt-3 text-xl font-bold text-slate-950">{category.name}</h3>
            <p className="mt-3 text-sm text-slate-500">{category.description || 'No description added.'}</p>
          </article>
        ))}

        {!categories.length ? <div className="panel p-8 text-center text-sm text-slate-500">No categories yet.</div> : null}
      </section>
    </div>
  );
}

export default Categories;