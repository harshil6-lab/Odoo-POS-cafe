import { createServiceClient } from './supabaseClient.js';

const roles = ['manager', 'waiter', 'cashier'];
const floors = ['Ground Floor', 'First Floor'];
const categories = ['Coffee', 'Tea', 'Snacks', 'Pizza', 'Pasta', 'Burger', 'Desserts', 'Water', 'Drinks'];

const menuItems = [
  { name: 'Latte', category: 'Coffee', price: 220, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cold Brew', category: 'Coffee', price: 240, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cappuccino', category: 'Coffee', price: 230, image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
  { name: 'Espresso', category: 'Coffee', price: 160, image_url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e0b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Americano', category: 'Coffee', price: 180, image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
  { name: 'Mocha', category: 'Coffee', price: 250, image_url: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' },
  { name: 'Masala Chai', category: 'Tea', price: 190, image_url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80' },
  { name: 'Green Tea', category: 'Tea', price: 180, image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80' },
  { name: 'Lemon Tea', category: 'Tea', price: 200, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80' },
  { name: 'Iced Coffee', category: 'Drinks', price: 230, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
  { name: 'Garlic Bread', category: 'Snacks', price: 170, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80' },
  { name: 'Fries', category: 'Snacks', price: 190, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80' },
  { name: 'Club Sandwich', category: 'Snacks', price: 320, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80' },
  { name: 'Veg Burger', category: 'Burger', price: 290, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cheese Burger', category: 'Burger', price: 340, image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80' },
  { name: 'Paneer Wrap', category: 'Snacks', price: 280, image_url: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?auto=format&fit=crop&w=900&q=80' },
  { name: 'Margherita Pizza', category: 'Pizza', price: 420, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80' },
  { name: 'Farmhouse Pizza', category: 'Pizza', price: 480, image_url: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=900&q=80' },
  { name: 'White Sauce Pasta', category: 'Pasta', price: 360, image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80' },
  { name: 'Red Sauce Pasta', category: 'Pasta', price: 350, image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80' },
  { name: 'Brownie', category: 'Desserts', price: 220, image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cheesecake', category: 'Desserts', price: 260, image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80' },
  { name: 'Chocolate Muffin', category: 'Desserts', price: 180, image_url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80' },
  { name: 'Veg Puff', category: 'Snacks', price: 110, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80' },
  { name: 'French Toast', category: 'Desserts', price: 210, image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80' },
  { name: 'Nachos', category: 'Snacks', price: 260, image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80' },
  { name: 'Veg Roll', category: 'Snacks', price: 190, image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80' },
  { name: 'Paneer Tikka', category: 'Snacks', price: 340, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80' },
  { name: 'Spring Rolls', category: 'Snacks', price: 220, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80' },
  { name: 'Veg Cutlet', category: 'Snacks', price: 170, image_url: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=900&q=80' },
];

function buildTables(floorName, prefix) {
  return Array.from({ length: 12 }, (_, index) => ({
    table_code: `${prefix}${index + 1}`,
    floor: floorName,
    status: 'available',
    seats: 4,
  }));
}

async function upsertByName(client, tableName, rows) {
  const { error } = await client.from(tableName).upsert(rows, { onConflict: 'name' });

  if (error) {
    throw error;
  }
}

async function seedRoles(client) {
  await upsertByName(client, 'roles', roles.map((name) => ({ name })));
}

async function seedFloors(client) {
  await upsertByName(client, 'floors', floors.map((name) => ({ name })));
}

async function seedCategories(client) {
  await upsertByName(client, 'categories', categories.map((name) => ({ name })));
}

async function loadLookupMap(client, tableName) {
  const { data, error } = await client.from(tableName).select('id, name');

  if (error) {
    throw error;
  }

  return new Map((data ?? []).map((row) => [row.name, row.id]));
}

async function seedTables(client) {
  const floorIds = await loadLookupMap(client, 'floors');
  const tableRows = [...buildTables('Ground Floor', 'G'), ...buildTables('First Floor', 'F')].map((table) => ({
    table_code: table.table_code,
    floor_id: floorIds.get(table.floor),
    status: table.status,
    seats: table.seats,
  }));

  const { error } = await client.from('tables').upsert(tableRows, { onConflict: 'table_code' });

  if (error) {
    throw error;
  }
}

async function seedMenuItems(client) {
  const categoryIds = await loadLookupMap(client, 'categories');
  const menuRows = menuItems.map((item) => ({
    name: item.name,
    category_id: categoryIds.get(item.category),
    price: item.price,
    image_url: item.image_url,
    is_available: true,
  }));

  const { error } = await client.from('menu_items').upsert(menuRows, { onConflict: 'name' });

  if (error) {
    throw error;
  }
}

async function seedKitchenOrders(client) {
  // Load table and menu_item IDs
  const { data: tables } = await client.from('tables').select('id, table_code');
  const { data: items } = await client.from('menu_items').select('id, name, price');

  if (!tables?.length || !items?.length) {
    console.warn('Skipping kitchen seed — tables or menu_items missing.');
    return;
  }

  const tableMap = new Map(tables.map((t) => [t.table_code, t.id]));
  const itemMap = new Map(items.map((i) => [i.name, { id: i.id, price: i.price }]));

  const dummyOrders = [
    {
      table_code: 'G1',
      customer_name: 'Aarav Sharma',
      payment_method: 'cash',
      status: 'pending',
      items: [
        { name: 'Margherita Pizza', qty: 1 },
        { name: 'Cold Brew', qty: 2 },
      ],
    },
    {
      table_code: 'G3',
      customer_name: 'Priya Patel',
      payment_method: 'upi_qr',
      status: 'pending',
      items: [
        { name: 'Club Sandwich', qty: 2 },
        { name: 'Masala Chai', qty: 2 },
        { name: 'Fries', qty: 1 },
      ],
    },
    {
      table_code: 'G5',
      customer_name: 'Rohan Mehta',
      payment_method: 'card',
      status: 'preparing',
      items: [
        { name: 'Cheese Burger', qty: 1 },
        { name: 'Fries', qty: 1 },
        { name: 'Iced Coffee', qty: 1 },
      ],
    },
    {
      table_code: 'G7',
      customer_name: 'Sneha Verma',
      payment_method: 'cash',
      status: 'preparing',
      items: [
        { name: 'White Sauce Pasta', qty: 1 },
        { name: 'Garlic Bread', qty: 2 },
      ],
    },
    {
      table_code: 'F2',
      customer_name: 'Vikram Singh',
      payment_method: 'upi_qr',
      status: 'cooking',
      items: [
        { name: 'Farmhouse Pizza', qty: 1 },
        { name: 'Nachos', qty: 1 },
        { name: 'Latte', qty: 2 },
      ],
    },
    {
      table_code: 'F4',
      customer_name: 'Ananya Gupta',
      payment_method: 'card',
      status: 'cooking',
      items: [
        { name: 'Paneer Tikka', qty: 1 },
        { name: 'Red Sauce Pasta', qty: 1 },
        { name: 'Green Tea', qty: 1 },
      ],
    },
    {
      table_code: 'G9',
      customer_name: 'Karan Joshi',
      payment_method: 'cash',
      status: 'ready',
      items: [
        { name: 'Veg Burger', qty: 2 },
        { name: 'Brownie', qty: 2 },
        { name: 'Cappuccino', qty: 2 },
      ],
    },
    {
      table_code: 'F6',
      customer_name: 'Meera Iyer',
      payment_method: 'upi_qr',
      status: 'ready',
      items: [
        { name: 'Spring Rolls', qty: 1 },
        { name: 'Paneer Wrap', qty: 1 },
        { name: 'Lemon Tea', qty: 2 },
      ],
    },
  ];

  for (const order of dummyOrders) {
    const tableId = tableMap.get(order.table_code);
    if (!tableId) continue;

    const { data: createdOrder, error: orderErr } = await client
      .from('orders')
      .insert({
        table_id: tableId,
        customer_name: order.customer_name,
        payment_method: order.payment_method,
        status: order.status,
      })
      .select('id')
      .single();

    if (orderErr) {
      console.error(`Order insert failed for ${order.customer_name}:`, orderErr.message);
      continue;
    }

    const orderItemRows = order.items
      .filter((i) => itemMap.has(i.name))
      .map((i) => ({
        order_id: createdOrder.id,
        menu_item_id: itemMap.get(i.name).id,
        quantity: i.qty,
        preferences: {},
      }));

    if (orderItemRows.length) {
      const { error: itemErr } = await client.from('order_items').insert(orderItemRows);
      if (itemErr) {
        console.error(`Order items insert failed for order ${createdOrder.id}:`, itemErr.message);
      }
    }

    // Mark table as occupied
    await client.from('tables').update({ status: 'occupied' }).eq('id', tableId);
  }

  console.log(`Seeded ${dummyOrders.length} kitchen orders.`);
}

export async function seedDatabase() {
  const client = createServiceClient();

  await seedRoles(client);
  await seedFloors(client);
  await seedCategories(client);
  await seedTables(client);
  await seedMenuItems(client);
  await seedKitchenOrders(client);
}

const isDirectRun = process.argv[1] && new URL(import.meta.url).pathname.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isDirectRun) {
  seedDatabase()
    .then(() => {
      console.log('Supabase seed completed successfully.');
    })
    .catch((error) => {
      console.error('Supabase seed failed.');
      console.error(error);
      process.exitCode = 1;
    });
}