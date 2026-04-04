export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const formatDateTime = (value) => {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unit_price ?? item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
  const taxAmount = subtotal * 0.05;
  const serviceCharge = subtotal * 0.02;
  const total = subtotal + taxAmount + serviceCharge;

  return {
    subtotal,
    taxAmount,
    serviceCharge,
    total,
  };
};

export const getStatusBadgeClass = (status) => {
  const colorMap = {
    available: 'bg-emerald-100 text-emerald-800',
    occupied: 'bg-amber-100 text-amber-800',
    reserved: 'bg-sky-100 text-sky-800',
    cleaning: 'bg-slate-100 text-slate-700',
    pending: 'bg-amber-100 text-amber-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-emerald-100 text-emerald-800',
    served: 'bg-violet-100 text-violet-800',
    completed: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-rose-100 text-rose-800',
  };

  return colorMap[status] ?? 'bg-slate-100 text-slate-700';
};

export const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');