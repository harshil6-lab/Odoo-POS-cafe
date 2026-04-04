import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartPanel from '../components/CartPanel';
import MenuCard from '../components/MenuCard';
import TableGrid from '../components/TableGrid';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppState } from '../context/AppStateContext';

export default function Menu() {
  const navigate = useNavigate();
  const {
    catalogItems,
    catalogCategories,
    selectedTableId,
    setSelectedTableId,
    cartItems,
    addCartItem,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    totals,
    customerDetails,
    setCustomerDetails,
    tables,
  } = useAppState();

  const categories = useMemo(() => ['All', ...catalogCategories.map((category) => category.name)], [catalogCategories]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showTablePicker, setShowTablePicker] = useState(!selectedTableId);
  const [activeItem, setActiveItem] = useState(null);
  const [specialRequest, setSpecialRequest] = useState('');

  useEffect(() => {
    setShowTablePicker(!selectedTableId);
  }, [selectedTableId]);

  const filteredItems = useMemo(
    () =>
      catalogItems.filter((item) => {
        const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
        const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, catalogItems, search],
  );

  const openItemModal = (item) => {
    setActiveItem(item);
    setSpecialRequest('');
  };

  const confirmItem = () => {
    if (!activeItem) {
      return;
    }

    const preferences = specialRequest.trim() ? [specialRequest.trim()] : [];
    addCartItem(activeItem, preferences);
    setActiveItem(null);
    setSpecialRequest('');
  };

  return (
    <div className="bg-background py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="space-y-6">
          <section className="glass-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍔</span>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">Cafe menu</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Browse our menu, add items with preferences, and checkout from your table.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                  {selectedTableId ? `🪑 Table ${selectedTableId}` : 'No table selected'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTablePicker(true)}
                >
                  Choose table
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr),auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu items..." className="pl-10" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-primary text-white shadow-glow-red'
                        : 'border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.length ? (
              filteredItems.map((item) => <MenuCard key={item.id} item={item} actionLabel="Add" onAdd={openItemModal} />)
            ) : (
              <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6 text-center text-sm text-slate-500">
                No menu items match this filter.
              </div>
            )}
          </section>
        </div>

        <div className="min-h-0">
          <CartPanel
            variant="customer"
            cartItems={cartItems}
            selectedTableId={selectedTableId}
            customerDetails={customerDetails}
            subtotal={totals.subtotal}
            tax={totals.taxAmount}
            total={totals.total}
            onCustomerChange={setCustomerDetails}
            onIncrease={(lineId) => updateCartQuantity(lineId, 1)}
            onDecrease={(lineId) => updateCartQuantity(lineId, -1)}
            onRemove={removeCartItem}
            onCheckout={() => navigate('/checkout')}
            onClearCart={clearCart}
          />
        </div>
      </div>

      {/* Table picker modal */}
      {showTablePicker ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-5xl glass-card p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Select your table</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Each QR code maps to a live table. You can also choose manually.
                </p>
              </div>
              {selectedTableId ? (
                <Button variant="outline" size="sm" onClick={() => setShowTablePicker(false)}>
                  Close
                </Button>
              ) : null}
            </div>

            <div className="mt-5 max-h-[70vh] overflow-y-auto pr-1">
              <TableGrid
                tables={tables}
                selectedTableId={selectedTableId}
                actionLabel="Use this table"
                emptyMessage="No table records returned from Supabase."
                onSelect={(table) => {
                  setSelectedTableId(table.id);
                  setShowTablePicker(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Item preferences modal */}
      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-xl glass-card p-6">
            <div className="grid gap-5 lg:grid-cols-[180px,1fr]">
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-surface">
                <img src={activeItem.imageUrl} alt={activeItem.name} className="aspect-[4/3] h-full w-full object-cover" />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-white">{activeItem.name}</h2>
                <p className="mt-1 text-sm text-slate-400">Add optional preferences for the kitchen.</p>
                <label className="mt-4 grid gap-1.5 text-xs text-slate-400">
                  Preferences
                  <textarea
                    value={specialRequest}
                    onChange={(event) => setSpecialRequest(event.target.value)}
                    placeholder="Less sugar, extra cheese, no onion"
                    className="min-h-24 rounded-xl border border-white/[0.08] bg-surface px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary/50"
                  />
                </label>

                <div className="mt-5 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveItem(null)}>Cancel</Button>
                  <Button size="sm" onClick={confirmItem}>Add to cart</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
