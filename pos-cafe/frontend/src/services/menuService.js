import { supabase } from './supabaseClient';

const menuSelect = 'id, name, price, image_url, is_available, category:categories(id, name)';

const fallbackImages = {
  Coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
  Tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
  Snacks: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
  Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
  Pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
  Burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  Desserts: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
  Water: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80',
  Drinks: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
};

function mapMenuItem(item) {
  const category = item.category?.name ?? 'Menu';

  return {
    id: item.id,
    name: item.name,
    category,
    price: Number(item.price ?? 0),
    imageUrl: item.image_url || fallbackImages[category] || fallbackImages.Drinks,
    isAvailable: Boolean(item.is_available),
    status: item.is_available ? 'Available' : 'Sold out',
    options: [],
  };
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getMenuItems() {
  const { data, error } = await supabase.from('menu_items').select(menuSelect).order('name');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapMenuItem);
}

export async function updateMenuItemAvailability(menuItemId, isAvailable) {
  const { data, error } = await supabase
    .from('menu_items')
    .update({
      is_available: Boolean(isAvailable),
      updated_at: new Date().toISOString(),
    })
    .eq('id', menuItemId)
    .select(menuSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapMenuItem(data);
}