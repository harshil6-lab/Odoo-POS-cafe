import { useMemo, useState } from 'react';
import CartDrawer from '../components/CartDrawer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { customerStatusPreview, menuItems } from '../data/restaurantData';
import { formatCurrency } from '../utils/helpers';

const CATEGORIES = ['Coffee', 'Tea', 'Snacks', 'Desserts'];

function MenuCard({ item, onAdd }) {
  const isAvailable = item.status !== 'Sold out';
  const badgeTone =
    item.status === 'Sold out'
      ? 'border-red-500/20 bg-red-500/10 text-red-300'
      : item.status === 'Low stock'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
        : 'border-teal-500/20 bg-teal-500/10 text-teal-300';

  return (
    <button
      type="button"
      onClick={() => onAdd(item)}
      disabled={!isAvailable}
      className="overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] text-left shadow-md transition hover:border-amber-500/30 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-100">{item.name}</p>
            <p className="mt-1 text-sm font-medium text-amber-400">{formatCurrency(item.price)}</p>
          </div>
          <span className={`rounded-md border px-2 py-1 text-xs ${badgeTone}`}>{item.status}</span>
        </div>
      </div>
    </button>
  );
}

export default function CustomerMenu() {
  const [activeCategory, setActiveCategory] = useState('Coffee');
  const [cart, setCart] = useState([]);

  const filteredItems = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );

  const addToCart = (item) => {
    if (item.status === 'Sold out') {
      return;
    }

    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem));
      }

      return [...current, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),340px]">
        <section className="rounded-xl border border-slate-800 bg-[#0F172A] shadow-md">
          <div className="border-b border-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Customer ordering</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-100">Browse and place your order</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? 'default' : 'outline'}
                  className="h-10 rounded-lg px-4 text-xs font-medium uppercase tracking-wide"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <div className="min-h-0">
          <CartDrawer
            cartItems={cart}
            total={total}
            orderStatus={customerStatusPreview}
            onRemove={removeFromCart}
            onCheckout={() => {}}
          />
        </div>
      </div>
    </div>
  );
}