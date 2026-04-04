import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CartPanel from './CartPanel';
import CategoryTabs from './CategoryTabs';
import Keypad from './Keypad';
import ProductGrid from './ProductGrid';
import { useAppState } from '../context/AppStateContext';
import { Input } from './ui/Input';
import { menuItems as seedMenuItems } from '../data/restaurantData';
import { calculateOrderTotals } from '../utils/helpers';

const INITIAL_CART = [{ ...seedMenuItems[0], qty: 2 }];

export default function RegisterLayout() {
  const { catalogItems, catalogCategories } = useAppState();
  const products = catalogItems.length ? catalogItems : seedMenuItems;
  const categories = ['All', ...new Set((catalogCategories.length ? catalogCategories.map((item) => item.name) : products.map((item) => item.category)))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState(INITIAL_CART);
  const [activeMode, setActiveMode] = useState('Qty');

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
        const searchMatch = product.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, products, search],
  );

  const totals = useMemo(() => calculateOrderTotals(cart), [cart]);

  const addToCart = (product) => {
    if (product.status === 'Sold out') {
      return;
    }

    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id);

      if (existingItem) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }

      return [...current, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + change) } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);

    if (mode === 'Delete') {
      setCart((current) => current.slice(0, -1));
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-11rem)] gap-5 xl:grid-cols-[30%_1fr_20%]">
      <div className="min-h-0 overflow-hidden xl:col-span-1">
        <CartPanel
          cartItems={cart}
          guestCount={guestCount}
          subtotal={totals.subtotal}
          tax={totals.taxAmount}
          total={totals.total}
          onGuestChange={setGuestCount}
          onIncrease={(id) => updateQuantity(id, 1)}
          onDecrease={(id) => updateQuantity(id, -1)}
          onRemove={removeItem}
          onSendToKitchen={() => setActiveMode('Qty')}
          onPayment={() => setActiveMode('Price override')}
          onClearCart={() => setCart([])}
        />
      </div>

      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-card shadow-md xl:col-span-1">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">Register</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Restaurant register</h1>
            </div>
            <div className="rounded-full border border-slate-800 bg-background px-4 py-2 text-sm font-medium text-text-secondary">
              Counter 03
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="pl-10"
            />
          </div>

          <CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />
        </div>

        <ProductGrid products={filteredProducts} onAdd={addToCart} />
      </section>

      <div className="min-h-0 xl:col-span-1">
        <Keypad activeMode={activeMode} onModeChange={handleModeChange} />
      </div>
    </div>
  );
}