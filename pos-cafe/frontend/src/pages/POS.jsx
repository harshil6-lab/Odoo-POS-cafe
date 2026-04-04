import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CartPanel from '../components/CartPanel';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { calculateOrderTotals } from '../utils/helpers';

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Snacks', 'Desserts'];

const PRODUCTS = [
  { id: 'espresso', name: 'Double Espresso', category: 'Coffee', price: 160, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e0b?auto=format&fit=crop&w=900&q=80' },
  { id: 'latte', name: 'Cafe Latte', category: 'Coffee', price: 220, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
  { id: 'cold-brew', name: 'Cold Brew', category: 'Coffee', price: 240, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
  { id: 'matcha', name: 'Matcha Tea', category: 'Tea', price: 210, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80' },
  { id: 'earl-grey', name: 'Earl Grey', category: 'Tea', price: 180, status: 'Hot', imageUrl: 'https://images.unsplash.com/photo-1594631661960-ef2d8f4f0c5f?auto=format&fit=crop&w=900&q=80' },
  { id: 'masala-chai', name: 'Masala Chai', category: 'Tea', price: 190, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80' },
  { id: 'fries', name: 'Truffle Fries', category: 'Snacks', price: 260, status: 'Low stock', imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80' },
  { id: 'club-sandwich', name: 'Club Sandwich', category: 'Snacks', price: 320, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80' },
  { id: 'garlic-bread', name: 'Garlic Bread', category: 'Snacks', price: 170, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80' },
  { id: 'brownie', name: 'Brownie Slice', category: 'Desserts', price: 190, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80' },
  { id: 'tiramisu', name: 'Mini Tiramisu', category: 'Desserts', price: 260, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80' },
  { id: 'cheesecake', name: 'Biscoff Cheesecake', category: 'Desserts', price: 280, status: 'Sold out', imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80' },
];

const INITIAL_CART = [
  { ...PRODUCTS[1], qty: 2 },
  { ...PRODUCTS[7], qty: 1 },
  { ...PRODUCTS[9], qty: 1 },
];

export default function POS() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState(INITIAL_CART);

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((product) => {
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

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="grid gap-3 p-3 xl:grid-cols-[minmax(320px,31%)_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]">
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
            onSendToKitchen={() => {}}
            onPayment={() => {}}
            onClearCart={() => setCart([])}
          />
        </div>

        <div className="min-w-0">
          <Card className="rounded-xl border-slate-800 bg-slate-900">
            <CardHeader className="gap-3 border-b border-slate-800 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Register</p>
                  <CardTitle className="mt-1 text-3xl text-white">Restaurant Register</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Counter 03
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Dine-in active
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="h-11 rounded-xl border-slate-800 bg-slate-950 pl-10 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <CategoryTabs categories={CATEGORIES} activeCategory={activeCategory} onChange={setActiveCategory} />
            </CardHeader>

            <CardContent className="p-3">
              <ProductGrid products={filteredProducts} onAdd={addToCart} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}