export const PUBLIC_NAV_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Reserve table', to: '/reserve-table' },
  { label: 'Floor layout', to: '/floor-layout' },
  { label: 'Contact', to: '/contact' },
];

export const APP_NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Register', to: '/register' },
  { label: 'Tables', to: '/tables' },
  { label: 'Kitchen', to: '/kitchen' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reports', to: '/reports' },
];

const redirectByRole = {
  customer: '/menu',
  waiter: '/dashboard',
  manager: '/dashboard',
  cashier: '/dashboard',
};

const badgeLabels = {
  customer: 'Customer workspace',
  waiter: 'Waiter workspace',
  cashier: 'Cashier workspace',
  manager: 'Manager workspace',
};

export function normalizeRole(role) {
  if (!role) {
    return 'customer';
  }

  const normalized = String(role).toLowerCase();

  if (normalized === 'kitchen') {
    return 'waiter';
  }

  if (normalized === 'admin') {
    return 'manager';
  }

  return normalized;
}

export function getRedirectPathForRole(role) {
  const normalized = normalizeRole(role);
  return redirectByRole[normalized] || '/customer-ordering';
}

export function getRoleBadgeLabel(role) {
  const normalized = normalizeRole(role);
  return badgeLabels[normalized] || 'Customer workspace';
}