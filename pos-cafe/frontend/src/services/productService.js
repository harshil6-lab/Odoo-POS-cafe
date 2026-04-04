import { cloneValue, slugify } from '../utils/helpers';
import { mockCategories, mockProducts } from '../utils/mockData';

let categoriesStore = cloneValue(mockCategories);
let productsStore = cloneValue(mockProducts);

const emitCatalogUpdate = () => {
  window.dispatchEvent(new CustomEvent('catalog:changed'));
};

export async function fetchCategories() {
  return cloneValue(categoriesStore).sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function fetchProducts() {
  return cloneValue(productsStore).map((product) => ({
    ...product,
    category: categoriesStore.find((category) => category.id === product.categoryId) ?? null,
  }));
}

export async function createCategory(payload) {
  const category = {
    id: `cat-${slugify(payload.name)}-${Date.now()}`,
    name: payload.name,
    color: payload.color,
    description: payload.description,
    sortOrder: categoriesStore.length + 1,
  };

  categoriesStore = [...categoriesStore, category];
  emitCatalogUpdate();
  return cloneValue(category);
}

export async function reorderCategories(nextCategories) {
  categoriesStore = nextCategories.map((category, index) => ({
    ...category,
    sortOrder: index + 1,
  }));
  emitCatalogUpdate();
  return cloneValue(categoriesStore);
}

export async function createProduct(payload) {
  const product = {
    id: `prod-${slugify(payload.name)}-${Date.now()}`,
    name: payload.name,
    categoryId: payload.categoryId,
    price: Number(payload.price),
    taxRate: Number(payload.taxRate),
    description: payload.description,
    variants: payload.variants,
    imageTone: payload.imageTone || 'from-brand-500/30 via-amber-500/10 to-slate-900',
    available: true,
  };

  productsStore = [product, ...productsStore];
  emitCatalogUpdate();
  return cloneValue(product);
}

export function subscribeCatalog(callback) {
  const handler = () => callback();
  window.addEventListener('catalog:changed', handler);
  return () => window.removeEventListener('catalog:changed', handler);
}