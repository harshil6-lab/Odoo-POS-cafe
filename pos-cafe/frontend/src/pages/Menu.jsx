import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartPanel from '../components/CartPanel';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppState } from '../context/AppStateContext';
import { menuItems } from '../data/restaurantData';
import { formatCurrency } from '../utils/helpers';

const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

export default function Menu() {
  const navigate = useNavigate();
  const {
    selectedTableId,
    setSelectedTableId,
    groundFloorTables,
    firstFloorTables,
    cartItems,
    addCartItem,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    totals,
    customerDetails,
    setCustomerDetails,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('Ground floor');
  const [manualTableId, setManualTableId] = useState(selectedTableId || '');
  const [showTablePicker, setShowTablePicker] = useState(!selectedTableId);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  useEffect(() => {
    if (selectedTableId) {
      setManualTableId(selectedTableId);
      setFloor(selectedTableId.startsWith('F') ? 'First floor' : 'Ground floor');
      setShowTablePicker(false);
    } else {
      setShowTablePicker(true);
    }
  }, [selectedTableId]);

  const floorTables = floor === 'Ground floor' ? groundFloorTables : firstFloorTables;

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
        const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, search],
  );

  const openItemModal = (item) => {
    const defaults = {};
    item.options?.forEach((option) => {
      if (option.name !== 'Add-ons') {
        defaults[option.name] = option.values[0];
      }
    });
    setSelectedOptions(defaults);
    setSelectedAddOns([]);
    setActiveItem(item);
  };

  const confirmItem = () => {
    if (!activeItem) {
      return;
    }

    const preferences = [
      ...Object.entries(selectedOptions).map(([label, value]) => `${label}: ${value}`),
      ...selectedAddOns,
    ];

    addCartItem(activeItem, preferences);
    setActiveItem(null);
  };

  return (
    <div className="bg-[#0B1220] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="space-y-8">
          <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#F9FAFB]">Cafe menu</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Browse the menu, choose your preferences, and add items to your order.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-300">
                  {selectedTableId ? `Ordering for Table ${selectedTableId}` : 'No table selected'}
                </div>
                <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => setShowTablePicker(true)}>
                  Change table
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr),auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu items" className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      activeCategory === category ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]' : 'border-[#374151] bg-[#1F2937] text-[#F9FAFB] hover:bg-[#111827]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-[#F9FAFB]">{item.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{formatCurrency(item.price)}</p>
                  </div>
                  <span className="rounded-full border border-[#374151] bg-[#111827] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-slate-300">
                    {item.category}
                  </span>
                </div>
                <Button className="mt-5 h-11 w-full rounded-xl border-[#F59E0B] bg-[#F59E0B] text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={() => openItemModal(item)}>
                  Quick add
                </Button>
              </article>
            ))}
          </div>
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

      {showTablePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-[#F9FAFB]">Select your table before ordering</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Choose the table you are ordering for. If you scanned a QR code, this will be filled automatically.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Floor
                <select value={floor} onChange={(event) => setFloor(event.target.value)} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]">
                  <option>Ground floor</option>
                  <option>First floor</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Table
                <select value={manualTableId} onChange={(event) => setManualTableId(event.target.value)} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]">
                  <option value="">Select a table</option>
                  {floorTables.map((table) => (
                    <option key={table.id} value={table.id}>{table.id} · {table.status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {selectedTableId ? (
                <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => { setManualTableId(selectedTableId || ''); setShowTablePicker(false); }}>
                  Cancel
                </Button>
              ) : null}
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" disabled={!manualTableId} onClick={() => { setSelectedTableId(manualTableId); setShowTablePicker(false); }}>
                Confirm table
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
              <div className="overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
                <img src={activeItem.imageUrl} alt={activeItem.name} className="aspect-[4/3] h-full w-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#F9FAFB]">{activeItem.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">Choose your preferred options before adding this item to the cart.</p>
                <p className="mt-4 text-sm font-medium text-amber-300">{formatCurrency(activeItem.price)}</p>

                <div className="mt-6 grid gap-4">
                  {activeItem.options?.map((option) => (
                    <div key={option.name} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4">
                      <p className="text-base font-medium text-[#F9FAFB]">{option.name}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {option.name === 'Add-ons'
                          ? option.values.map((value) => {
                              const active = selectedAddOns.includes(value);
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setSelectedAddOns((current) => (active ? current.filter((item) => item !== value) : [...current, value]))}
                                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${active ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]' : 'border-[#374151] bg-[#111827] text-[#F9FAFB] hover:bg-[#0B1220]'}`}
                                >
                                  {value}
                                </button>
                              );
                            })
                          : option.values.map((value) => {
                              const active = selectedOptions[option.name] === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setSelectedOptions((current) => ({ ...current, [option.name]: value }))}
                                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${active ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]' : 'border-[#374151] bg-[#111827] text-[#F9FAFB] hover:bg-[#0B1220]'}`}
                                >
                                  {value}
                                </button>
                              );
                            })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => setActiveItem(null)}>
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
