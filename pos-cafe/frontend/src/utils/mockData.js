const now = new Date();

export const mockCafeInfo = {
  name: 'POS Cafe',
  city: 'Ahmedabad',
  address: '12 Roast House Lane, Prahlad Nagar, Ahmedabad',
  phone: '+91 98765 43210',
  email: 'hello@poscafe.in',
  hours: [
    { label: 'Monday - Friday', value: '7:00 AM - 11:00 PM' },
    { label: 'Saturday', value: '8:00 AM - 12:00 AM' },
    { label: 'Sunday', value: '8:00 AM - 10:00 PM' },
  ],
};

export const mockTestimonials = [
  {
    id: 't1',
    name: 'Rhea Patel',
    role: 'Regular guest',
    quote: 'Ordering at the table is fast, the drinks arrive on time, and the whole place feels premium without being stiff.',
  },
  {
    id: 't2',
    name: 'Nikhil Shah',
    role: 'Corporate events lead',
    quote: 'The kitchen screen and floor control give the team a much smoother service flow during peak lunch hours.',
  },
  {
    id: 't3',
    name: 'Meera Trivedi',
    role: 'Weekend brunch customer',
    quote: 'The QR menu is clean and the customer display makes pickup orders much easier to follow.',
  },
];

export const mockGallery = [
  { id: 'g1', title: 'Roasting Bar', tone: 'from-amber-500/30 via-orange-500/10 to-transparent' },
  { id: 'g2', title: 'Chef Counter', tone: 'from-teal-400/25 via-sky-500/10 to-transparent' },
  { id: 'g3', title: 'Evening Seating', tone: 'from-rose-500/20 via-amber-500/10 to-transparent' },
  { id: 'g4', title: 'Signature Brew', tone: 'from-brand-500/30 via-yellow-400/10 to-transparent' },
  { id: 'g5', title: 'Patio Lounge', tone: 'from-cyan-500/20 via-teal-400/10 to-transparent' },
];

export const mockCategories = [
  { id: 'cat-coffee', name: 'Coffee', color: '#f59e0b', description: 'Espresso based and slow bar classics', sortOrder: 1 },
  { id: 'cat-tea', name: 'Tea', color: '#14b8a6', description: 'Chai rituals and premium teas', sortOrder: 2 },
  { id: 'cat-bakes', name: 'Bakery', color: '#fb7185', description: 'Fresh bakes for all day pairing', sortOrder: 3 },
  { id: 'cat-brunch', name: 'Brunch', color: '#38bdf8', description: 'Plates for breakfast and lunch sessions', sortOrder: 4 },
  { id: 'cat-dessert', name: 'Dessert', color: '#c084fc', description: 'Sweet finishers and plated specials', sortOrder: 5 },
];

export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Reserve Cappuccino',
    categoryId: 'cat-coffee',
    price: 220,
    taxRate: 5,
    description: 'Velvet milk texture with a chocolate-forward roast.',
    imageTone: 'from-amber-500/35 via-orange-500/15 to-slate-900',
    variants: ['Single', 'Double'],
    available: true,
  },
  {
    id: 'prod-2',
    name: 'Cold Brew Citrus',
    categoryId: 'cat-coffee',
    price: 260,
    taxRate: 5,
    description: 'Slow steeped coffee finished with bright citrus oils.',
    imageTone: 'from-teal-400/35 via-sky-500/15 to-slate-900',
    variants: ['Regular', 'Large'],
    available: true,
  },
  {
    id: 'prod-3',
    name: 'Masala Chai Pot',
    categoryId: 'cat-tea',
    price: 160,
    taxRate: 5,
    description: 'Spiced chai simmered slow and served table-side.',
    imageTone: 'from-amber-400/30 via-rose-500/10 to-slate-900',
    variants: ['1 Pot'],
    available: true,
  },
  {
    id: 'prod-4',
    name: 'Croissant Sandwich',
    categoryId: 'cat-brunch',
    price: 340,
    taxRate: 5,
    description: 'Layered eggs, cheese, and smoked tomato jam.',
    imageTone: 'from-yellow-400/30 via-orange-500/10 to-slate-900',
    variants: ['Veg', 'Chicken'],
    available: true,
  },
  {
    id: 'prod-5',
    name: 'Almond Kouign-Amann',
    categoryId: 'cat-bakes',
    price: 180,
    taxRate: 5,
    description: 'Crisp laminated pastry with toasted almond glaze.',
    imageTone: 'from-amber-500/30 via-yellow-500/10 to-slate-900',
    variants: ['Standard'],
    available: true,
  },
  {
    id: 'prod-6',
    name: 'Tiramisu Jar',
    categoryId: 'cat-dessert',
    price: 240,
    taxRate: 5,
    description: 'Espresso-soaked sponge layered with mascarpone cream.',
    imageTone: 'from-violet-500/30 via-pink-500/10 to-slate-900',
    variants: ['Classic'],
    available: true,
  },
  {
    id: 'prod-7',
    name: 'Affogato Royale',
    categoryId: 'cat-dessert',
    price: 280,
    taxRate: 5,
    description: 'Vanilla gelato with a double ristretto pour-over.',
    imageTone: 'from-amber-500/30 via-teal-400/10 to-slate-900',
    variants: ['Classic'],
    available: true,
  },
  {
    id: 'prod-8',
    name: 'Matcha Sparkler',
    categoryId: 'cat-tea',
    price: 230,
    taxRate: 5,
    description: 'Ceremonial matcha, tonic, and lime peel.',
    imageTone: 'from-lime-500/30 via-emerald-500/10 to-slate-900',
    variants: ['Regular'],
    available: true,
  },
];

export const mockTables = [
  { id: 'table-1', name: 'T1', seats: 2, status: 'available', zone: 'Window Bar', x: 18, y: 20, revenue: 0 },
  { id: 'table-2', name: 'T2', seats: 4, status: 'occupied', zone: 'Main Hall', x: 38, y: 28, revenue: 1380 },
  { id: 'table-3', name: 'T3', seats: 4, status: 'reserved', zone: 'Main Hall', x: 56, y: 34, revenue: 0 },
  { id: 'table-4', name: 'T4', seats: 6, status: 'cleaning', zone: 'Patio', x: 72, y: 18, revenue: 0 },
  { id: 'table-5', name: 'T5', seats: 2, status: 'available', zone: 'Patio', x: 22, y: 52, revenue: 0 },
  { id: 'table-6', name: 'T6', seats: 4, status: 'occupied', zone: 'Chef Counter', x: 48, y: 58, revenue: 1960 },
  { id: 'table-7', name: 'T7', seats: 4, status: 'available', zone: 'Lounge', x: 70, y: 60, revenue: 0 },
  { id: 'table-8', name: 'T8', seats: 8, status: 'reserved', zone: 'Private Booth', x: 84, y: 34, revenue: 0 },
];

export const mockOrders = [
  {
    id: 'ord-1',
    orderNumber: '2401',
    tableId: 'table-2',
    customerName: 'Rohan',
    status: 'to-cook',
    diningStatus: 'occupied',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: 'No sugar in latte',
    createdAt: new Date(now.getTime() - 18 * 60000).toISOString(),
    items: [
      { id: 'ord1-item1', productId: 'prod-1', name: 'Reserve Cappuccino', quantity: 2, unitPrice: 220, course: 'drinks' },
      { id: 'ord1-item2', productId: 'prod-4', name: 'Croissant Sandwich', quantity: 1, unitPrice: 340, course: 'food' },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '2402',
    tableId: 'table-6',
    customerName: 'Walk-in',
    status: 'preparing',
    diningStatus: 'occupied',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: 'Pack one dessert separately',
    createdAt: new Date(now.getTime() - 34 * 60000).toISOString(),
    items: [
      { id: 'ord2-item1', productId: 'prod-2', name: 'Cold Brew Citrus', quantity: 2, unitPrice: 260, course: 'drinks' },
      { id: 'ord2-item2', productId: 'prod-6', name: 'Tiramisu Jar', quantity: 1, unitPrice: 240, course: 'dessert' },
    ],
  },
  {
    id: 'ord-3',
    orderNumber: '2403',
    tableId: null,
    customerName: 'Aditi',
    status: 'completed',
    diningStatus: 'completed',
    paymentMethod: 'upi_qr',
    paymentStatus: 'paid',
    notes: 'Pickup counter order',
    createdAt: new Date(now.getTime() - 52 * 60000).toISOString(),
    items: [
      { id: 'ord3-item1', productId: 'prod-3', name: 'Masala Chai Pot', quantity: 1, unitPrice: 160, course: 'drinks' },
      { id: 'ord3-item2', productId: 'prod-5', name: 'Almond Kouign-Amann', quantity: 2, unitPrice: 180, course: 'bakery' },
    ],
  },
  {
    id: 'ord-4',
    orderNumber: '2404',
    tableId: 'table-8',
    customerName: 'Corporate Dinner',
    status: 'to-cook',
    diningStatus: 'reserved',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    notes: 'Serve desserts after mains',
    createdAt: new Date(now.getTime() - 8 * 60000).toISOString(),
    items: [
      { id: 'ord4-item1', productId: 'prod-4', name: 'Croissant Sandwich', quantity: 3, unitPrice: 340, course: 'food' },
      { id: 'ord4-item2', productId: 'prod-7', name: 'Affogato Royale', quantity: 2, unitPrice: 280, course: 'dessert' },
    ],
  },
];

export const mockSessions = [
  { label: 'Breakfast', orders: 24, revenue: 8240, avgTime: 18 },
  { label: 'Lunch', orders: 38, revenue: 14220, avgTime: 22 },
  { label: 'Evening', orders: 46, revenue: 18880, avgTime: 26 },
  { label: 'Late Night', orders: 19, revenue: 7360, avgTime: 14 },
];

export const mockRevenueTrend = [
  { label: 'Mon', revenue: 12200, orders: 48 },
  { label: 'Tue', revenue: 13850, orders: 52 },
  { label: 'Wed', revenue: 14980, orders: 58 },
  { label: 'Thu', revenue: 16420, orders: 64 },
  { label: 'Fri', revenue: 20340, orders: 78 },
  { label: 'Sat', revenue: 24100, orders: 90 },
  { label: 'Sun', revenue: 18780, orders: 69 },
];

export const mockPaymentAnalytics = [
  { label: 'Cash', value: 26 },
  { label: 'Card', value: 41 },
  { label: 'UPI QR', value: 33 },
];

export const mockTeamMembers = [
  { id: 'staff-1', name: 'Aarav Patel', role: 'Floor Manager', email: 'aarav@poscafe.in' },
  { id: 'staff-2', name: 'Mira Desai', role: 'Shift Barista', email: 'mira@poscafe.in' },
  { id: 'staff-3', name: 'Kabir Shah', role: 'Kitchen Lead', email: 'kabir@poscafe.in' },
];
