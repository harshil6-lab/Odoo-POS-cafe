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
          <section className="rounded-xl border border-slate-800 bg-card p-4 shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">Cafe menu</h1>
                <p className="mt-3 text-sm text-text-secondary">
                  Live menu items are loaded from Supabase. Add items, include preferences, and finish checkout from your table.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-slate-800 bg-background px-4 py-2 text-sm text-white">
                  {selectedTableId ? `Ordering for Table ${selectedTableId}` : 'Please select your table first'}
                </div>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-slate-800 bg-slate-800 px-5 text-sm text-white hover:bg-card"
                  onClick={() => setShowTablePicker(true)}
                >
                  Choose table
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr),auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu items" className="pl-10" />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      activeCategory === category
                        ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]'
                        : 'border-[#374151] bg-[#1F2937] text-[#F9FAFB] hover:bg-[#111827]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 py-10 md:grid-cols-2 xl:grid-cols-4">
            {filteredItems.length ? (
              filteredItems.map((item) => <MenuCard key={item.id} item={item} actionLabel="Add" onAdd={openItemModal} />)
            ) : (
              <div className="md:col-span-2 xl:col-span-4 rounded-xl border border-dashed border-[#374151] bg-[#111827] p-6 text-sm text-[#9CA3AF]">
                No menu items match this filter right now.
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

      {showTablePicker ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-5xl rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#F9FAFB]">Please select your table first</h2>
                <p className="mt-2 text-sm text-[#9CA3AF]">
                  Each QR code maps to a live table in Supabase. You can also choose the table manually here.
                </p>
              </div>
              {selectedTableId ? (
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]"
                  onClick={() => setShowTablePicker(false)}
                >
                  Close
                </Button>
              ) : null}
            </div>

            <div className="mt-6 max-h-[70vh] overflow-y-auto pr-1">
              <TableGrid
                tables={tables}
                selectedTableId={selectedTableId}
                actionLabel="Use this table"
                emptyMessage="No table records were returned from Supabase."
                onSelect={(table) => {
                  setSelectedTableId(table.id);
                  setShowTablePicker(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <div className="grid gap-5 lg:grid-cols-[180px,1fr]">
              <div className="overflow-hidden rounded-xl border border-[#374151] bg-[#0B1220]">
                <img src={activeItem.imageUrl} alt={activeItem.name} className="aspect-[4/3] h-full w-full object-cover" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#F9FAFB]">{activeItem.name}</h2>
                <p className="mt-2 text-sm text-[#9CA3AF]">Add optional preferences for the kitchen before this item goes into your order.</p>
                <label className="mt-5 grid gap-2 text-sm text-[#F9FAFB]">
                  Preferences
                  <textarea
                    value={specialRequest}
                    onChange={(event) => setSpecialRequest(event.target.value)}
                    placeholder="Less sugar, extra cheese, no onion"
                    className="min-h-28 rounded-xl border border-[#374151] bg-[#0B1220] px-3 py-3 text-sm text-[#F9FAFB] outline-none transition focus:border-[#F59E0B]"
                  />
                </label>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]"
                    onClick={() => setActiveItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={confirmItem}>
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
