import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CartPanel from './CartPanel';
import CategoryTabs from './CategoryTabs';
import Keypad from './Keypad';
import ProductGrid from './ProductGrid';
import { Input } from './ui/Input';
import { menuItems } from '../data/restaurantData';
import { calculateOrderTotals } from '../utils/helpers';

const CATEGORIES = ['All', ...new Set(menuItems.map((item) => item.category))];

const INITIAL_CART = [
  { ...menuItems[0], qty: 2 },
  { ...menuItems[9], qty: 1 },
  { ...menuItems[16], qty: 1 },
];

export default function RegisterLayout() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState(INITIAL_CART);
  const [activeMode, setActiveMode] = useState('Qty');

  const filteredProducts = useMemo(
    () =>
      menuItems.filter((product) => {
        const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
        const searchMatch = product.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, search],
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
    <div className="grid min-h-[calc(100vh-11rem)] gap-5 md:grid-cols-2 xl:grid-cols-[30%_50%_20%]">
      <div className="min-h-0 overflow-hidden">
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

      <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#111827] shadow-[0_24px_60px_rgba(2,6,23,0.38)]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Register</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-100">Restaurant register</h1>
            </div>
            <div className="rounded-full border border-white/10 bg-[#0B1220] px-4 py-2 text-sm font-medium text-slate-300">
              Counter 03
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="pl-10"
            />
          </div>

          <CategoryTabs categories={CATEGORIES} activeCategory={activeCategory} onChange={setActiveCategory} />
        </div>

        <ProductGrid products={filteredProducts} onAdd={addToCart} />
      </section>

      <div className="min-h-0 md:col-span-2 xl:col-span-1">
        <Keypad activeMode={activeMode} onModeChange={handleModeChange} />
      </div>
    </div>
  );
}