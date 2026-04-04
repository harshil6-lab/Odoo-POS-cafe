export const PUBLIC_NAV_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Cart', to: '/cart' },
  { label: 'Reserve table', to: '/reserve-table' },
  { label: 'Track order', to: '/track-order' },
  { label: 'Contact', to: '/contact' },
];

export const APP_NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Register', to: '/register' },
  { label: 'Billing', to: '/billing' },
  { label: 'Tables', to: '/tables' },
  { label: 'Kitchen', to: '/kitchen' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reports', to: '/reports' },
  { label: 'Staff', to: '/staff' },
  { label: 'Menu Editor', to: '/menu-editor' },
  { label: 'Reservations', to: '/reservations' },
];

export const rolePermissions = {
  manager: ['dashboard', 'tables', 'register', 'billing', 'kitchen', 'orders', 'reports', 'staff', 'menu-editor', 'reservations'],
  waiter: ['tables', 'register'],
  cashier: ['tables', 'billing'],
  chef: ['kitchen'],
};

const routeToPermission = {
  '/dashboard': 'dashboard',
  '/register': 'register',
  '/billing': 'billing',
  '/tables': 'tables',
  '/kitchen': 'kitchen',
  '/orders': 'orders',
  '/reports': 'reports',
  '/staff': 'staff',
  '/menu-editor': 'menu-editor',
  '/reservations': 'reservations',
};

export function getNavLinksForRole(role) {
  const normalized = normalizeRole(role);
  const allowed = rolePermissions[normalized] || [];
  return APP_NAV_LINKS.filter((link) => {
    const perm = routeToPermission[link.to];
    return perm && allowed.includes(perm);
  });
}

const redirectByRole = {
  customer: '/menu',
  waiter: '/register',
  manager: '/dashboard',
  cashier: '/billing',
  chef: '/kitchen',
};

const badgeLabels = {
  customer: 'Customer workspace',
  waiter: 'Waiter',
  cashier: 'Cashier',
  manager: 'Manager',
  chef: 'Chef',
};

export function normalizeRole(role) {
  if (!role) {
    return 'customer';
  }

  const normalized = String(role).toLowerCase();

  if (normalized === 'admin') {
    return 'manager';
  }

  return normalized;
}

export function getRedirectPathForRole(role) {
  const normalized = normalizeRole(role);
  return redirectByRole[normalized] || '/menu';
}

export function getRoleBadgeLabel(role) {
  const normalized = normalizeRole(role);
  return badgeLabels[normalized] || 'Customer workspace';
}