import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { createProduct, fetchCategories, fetchProducts } from '../services/orderService';

const initialForm = {
  name: '',
  category_id: '',
  price: '',
  sku: '',
  image_url: '',
};

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);

    try {
      const [productData, categoryData] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(productData);
      setCategories(categoryData);
      setError('');
    } catch (err) {
      setError(err.message ?? 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        category_id: form.category_id || null,
      });
      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(err.message ?? 'Unable to create product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <form className="panel p-6" onSubmit={handleSubmit}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Catalog</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Add product</h2>

          <div className="mt-6 space-y-4">
            <input className="input" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
            <select className="input" name="category_id" value={form.category_id} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input className="input" name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input className="input" name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
            <input className="input" name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
          </div>

          {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

          <button type="submit" className="btn-primary mt-6 w-full" disabled={saving}>
            {saving ? 'Saving product...' : 'Create product'}
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={() => {}} />
          ))}

          {!loading && !products.length ? (
            <div className="panel col-span-full p-8 text-center text-sm text-slate-500">No products yet.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default Products;