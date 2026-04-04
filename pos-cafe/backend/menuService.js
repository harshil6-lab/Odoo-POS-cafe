import { supabase } from './supabaseClient.js';

const menuSelect = 'id, name, price, image_url, is_available, category:categories(id, name)';

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

  return data ?? [];
}