import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const classNames = cn;

export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat('en-IN');

export const formatCurrency = (value) => currencyFormatter.format(Number(value ?? 0));

export const formatNumber = (value) => numberFormatter.format(Number(value ?? 0));

export const formatDateTime = (value) => {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const calculateOrderTotals = (items, discountAmount = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unitPrice ?? item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
  const appliedDiscount = Math.min(discountAmount, subtotal);
  const taxableAmount = Math.max(subtotal - appliedDiscount, 0);
  const taxAmount = taxableAmount * 0.05;
  const serviceCharge = taxableAmount * 0.03;
  const total = taxableAmount + taxAmount + serviceCharge;

  return {
    subtotal,
    discountAmount: appliedDiscount,
    taxableAmount,
    taxAmount,
    serviceCharge,
    total,
  };
};

export const getStatusTone = (status) => {
  const map = {
    available: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    occupied: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    reserved: 'bg-sky-500/15 text-sky-300 border-sky-400/20',
    cleaning: 'bg-slate-500/15 text-slate-300 border-slate-400/20',
    'to-cook': 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    preparing: 'bg-teal-500/15 text-teal-300 border-teal-400/20',
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    pending: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
  };

  return map[status] ?? 'bg-slate-500/15 text-slate-300 border-slate-400/20';
};

export const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join('');

export const toSentenceCase = (value = '') =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const cloneValue = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

export const buildCsv = (rows) => {
  if (!rows.length) {
    return '';
  }

  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','));
  return [headers.join(','), ...lines].join('\n');
};
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