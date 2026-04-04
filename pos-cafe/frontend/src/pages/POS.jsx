import { useEffect, useMemo, useState } from 'react';
import OrderSummary from '../components/OrderSummary';
import PaymentModal from '../components/PaymentModal';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import {
  createOrderWithItemsAndPayment,
  fetchCategories,
  fetchProducts,
  fetchTables,
} from '../services/orderService';
import { calculateOrderTotals } from '../utils/helpers';

function POS() {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tableData, categoryData, productData] = await Promise.all([
          fetchTables(),
          fetchCategories(),
          fetchProducts(),
        ]);

        setTables(tableData);
        setCategories(categoryData);
        setProducts(productData);
      } catch (err) {
        setError(err.message ?? 'Unable to load POS data.');
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category_id === selectedCategory;
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, searchTerm, selectedCategory]);

  const totals = useMemo(() => calculateOrderTotals(cartItems), [cartItems]);

  const addToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { id: product.id, product_id: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
    });
  };

  const changeQuantity = (id, delta) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const resetOrder = () => {
    setCartItems([]);
    setCustomerName('');
    setSelectedTable('');
    setPaymentOpen(false);
  };

  const handlePayment = async (paymentDetails) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createOrderWithItemsAndPayment({
        order: {
          table_id: selectedTable || null,
          user_id: user.id,
          customer_name: customerName || null,
          status: 'pending',
          order_type: selectedTable ? 'dine-in' : 'counter',
        },
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        payment: {
          user_id: user.id,
          method: paymentDetails.method,
          amount: paymentDetails.amount,
          provider_reference: paymentDetails.provider_reference,
        },
      });

      setSuccess('Order created and payment recorded successfully.');
      resetOrder();
    } catch (err) {
      setError(err.message ?? 'Unable to complete the order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
      <section className="space-y-6">
        <div className="panel p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr,220px,220px]">
            <label className="block text-sm font-medium text-slate-700">
              Search menu
              <input
                className="input mt-2"
                type="text"
                placeholder="Search by item name or SKU"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Table
              <select
                className="input mt-2"
                value={selectedTable}
                onChange={(event) => setSelectedTable(event.target.value)}
              >
                <option value="">Walk-in / takeaway</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Customer name
              <input
                className="input mt-2"
                type="text"
                placeholder="Optional guest name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {success ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}
        </div>

        <div className="panel p-5">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedCategory === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedCategory === category.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}

          {!filteredProducts.length ? (
            <div className="panel col-span-full p-8 text-center text-sm text-slate-500">No products match the current filters.</div>
          ) : null}
        </div>
      </section>

      <OrderSummary
        cartItems={cartItems}
        totals={totals}
        onQuantityChange={changeQuantity}
        onRemoveItem={removeItem}
        onCheckout={() => setPaymentOpen(true)}
      />

      <PaymentModal
        isOpen={paymentOpen}
        total={totals.total}
        isProcessing={submitting}
        onClose={() => setPaymentOpen(false)}
        onConfirm={handlePayment}
      />
    </div>
  );
}

export default POS;