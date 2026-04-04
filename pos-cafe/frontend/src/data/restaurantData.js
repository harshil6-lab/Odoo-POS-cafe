export const staffRoles = [
  { value: 'waiter', label: 'Waiter' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'manager', label: 'Manager' },
];

export const menuItems = [
  { id: 'latte', name: 'Latte', category: 'Coffee', price: 220, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Small', 'Medium', 'Large'] }, { name: 'Serve', values: ['Hot', 'Cold'] }] },
  { id: 'cold-brew', name: 'Cold Brew', category: 'Coffee', price: 240, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Small', 'Medium', 'Large'] }] },
  { id: 'cappuccino', name: 'Cappuccino', category: 'Coffee', price: 230, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Small', 'Medium', 'Large'] }, { name: 'Serve', values: ['Hot', 'Cold'] }] },
  { id: 'espresso', name: 'Espresso', category: 'Coffee', price: 160, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e0b?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Shot', values: ['Single', 'Double'] }] },
  { id: 'masala-chai', name: 'Masala Chai', category: 'Tea', price: 190, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Small', 'Medium', 'Large'] }, { name: 'Serve', values: ['Hot'] }] },
  { id: 'green-tea', name: 'Green Tea', category: 'Tea', price: 180, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Small', 'Medium'] }] },
  { id: 'iced-lemon-tea', name: 'Iced Lemon Tea', category: 'Tea', price: 200, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Ice level', values: ['Light', 'Regular', 'Extra'] }] },
  { id: 'garlic-bread', name: 'Garlic Bread', category: 'Snacks', price: 170, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Add-ons', values: ['Extra dip', 'Cheese topping'] }] },
  { id: 'fries', name: 'Fries', category: 'Snacks', price: 190, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Style', values: ['Classic', 'Peri peri'] }] },
  { id: 'club-sandwich', name: 'Club Sandwich', category: 'Snacks', price: 320, status: 'Chef special', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Extras', values: ['Extra sauce', 'Add cheese'] }] },
  { id: 'veg-burger', name: 'Veg Burger', category: 'Burger', price: 290, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Add-ons', values: ['Add cheese', 'Extra sauce'] }] },
  { id: 'paneer-burger', name: 'Paneer Burger', category: 'Burger', price: 340, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Add-ons', values: ['Add cheese', 'Extra sauce'] }] },
  { id: 'margherita-pizza', name: 'Margherita Pizza', category: 'Pizza', price: 420, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Regular', 'Large'] }, { name: 'Crust', values: ['Classic', 'Thin'] }] },
  { id: 'farmhouse-pizza', name: 'Farmhouse Pizza', category: 'Pizza', price: 480, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Size', values: ['Regular', 'Large'] }, { name: 'Crust', values: ['Classic', 'Thin'] }] },
  { id: 'white-sauce-pasta', name: 'White Sauce Pasta', category: 'Pasta', price: 360, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Portion', values: ['Regular', 'Large'] }] },
  { id: 'arrabbiata-pasta', name: 'Arrabbiata Pasta', category: 'Pasta', price: 350, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Spice', values: ['Mild', 'Medium', 'Hot'] }] },
  { id: 'brownie', name: 'Brownie', category: 'Desserts', price: 220, status: 'Popular', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Serving', values: ['Classic', 'With ice cream'] }] },
  { id: 'cheesecake', name: 'Cheesecake', category: 'Desserts', price: 260, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Slice', values: ['Classic', 'Berry glaze'] }] },
  { id: 'mineral-water', name: 'Mineral Water', category: 'Water', price: 60, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Bottle', values: ['500 ml', '1 litre'] }] },
  { id: 'sparkling-water', name: 'Sparkling Water', category: 'Water', price: 90, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', options: [{ name: 'Bottle', values: ['300 ml', '750 ml'] }] },
];

export const featuredItems = ['latte', 'cold-brew', 'masala-chai', 'club-sandwich'];
export const popularItems = ['latte', 'cappuccino', 'masala-chai', 'margherita-pizza', 'white-sauce-pasta', 'brownie'];

export const orderSteps = [
  { title: 'Scan table QR', detail: 'Guests scan the table QR and open the menu with the table already selected.' },
  { title: 'Place order instantly', detail: 'Preferences, quantities, and customer details stay inside one clean flow.' },
  { title: 'Track kitchen status live', detail: 'Tickets move through the kitchen board while floor staff stays informed.' },
];

export const contactDetails = {
  address: '42 Riverfront Road, Ahmedabad, Gujarat',
  phone: '+91 98765 43210',
  email: 'hello@poscafe.example',
  hours: 'Mon-Sun · 8:00 AM to 11:00 PM',
};

const tableOverrides = {
  G2: { status: 'occupied' },
  G5: { status: 'occupied' },
  G8: { status: 'cleaning' },
  G11: { status: 'occupied' },
  F3: { status: 'occupied' },
  F6: { status: 'cleaning' },
  F9: { status: 'occupied' },
  F12: { status: 'occupied' },
};

function buildFloorTables(prefix, floorName) {
  return Array.from({ length: 12 }, (_, index) => {
    const number = index + 1;
    const id = `${prefix}${number}`;
    const baseTable = {
      id,
      label: `Table ${id}`,
      floor: floorName,
      status: 'available',
      seats: number % 3 === 0 ? 6 : number % 2 === 0 ? 4 : 2,
      zone: prefix === 'G' ? 'Ground floor' : 'First floor',
      note: prefix === 'G' ? 'Near the cafe service aisle.' : 'Upstairs dining section with quieter seating.',
      orderAmount: number % 4 === 0 ? '₹1,260' : number % 5 === 0 ? '₹780' : '₹0',
      server: number % 2 === 0 ? 'Riya' : 'Aarav',
    };

    return {
      ...baseTable,
      ...(tableOverrides[id] || {}),
    };
  });
}

export const tablesData = [...buildFloorTables('G', 'Ground floor'), ...buildFloorTables('F', 'First floor')];

export const initialReservations = [
  { id: 'RSV-G4', tableId: 'G4', name: 'Niharika Shah', guests: 4, date: '2026-04-05', time: '19:30' },
  { id: 'RSV-F7', tableId: 'F7', name: 'Rohan Patel', guests: 2, date: '2026-04-05', time: '20:00' },
];

export const kitchenTickets = [
  { id: 'K-501', tableId: 'G5', status: 'Preparing', items: ['Latte x2', 'Garlic Bread x1'], timer: '03:20' },
  { id: 'K-502', tableId: 'F3', status: 'Cooking', items: ['Margherita Pizza x1', 'Fries x1'], timer: '07:45' },
  { id: 'K-503', tableId: 'G11', status: 'Ready', items: ['Cold Brew x1', 'Brownie x1'], timer: '10:05' },
  { id: 'K-504', tableId: 'F9', status: 'Served', items: ['White Sauce Pasta x1', 'Mineral Water x2'], timer: '14:15' },
];

export const revenueData = [
  { slot: '09:00', revenue: 12000 },
  { slot: '11:00', revenue: 18200 },
  { slot: '13:00', revenue: 26800 },
  { slot: '15:00', revenue: 19400 },
  { slot: '17:00', revenue: 22300 },
  { slot: '19:00', revenue: 31500 },
];

export const dashboardMetrics = [
  { label: 'Tables in service', value: '14', meta: 'Across both floors', tone: 'text-amber-400' },
  { label: 'Open reservations', value: '6', meta: 'Today', tone: 'text-sky-300' },
  { label: 'Kitchen tickets', value: '9', meta: 'Preparing to served', tone: 'text-emerald-300' },
  { label: 'Average bill', value: '₹1,180', meta: 'Current shift', tone: 'text-slate-100' },
];

export const customerStatusPreview = [
  { label: 'Order placed', state: 'done' },
  { label: 'Kitchen preparing', state: 'active' },
  { label: 'Ready to serve', state: 'upcoming' },
];