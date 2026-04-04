import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export function formatElapsedTime(minutes = 0) {
  const totalMinutes = Math.max(0, Math.floor(Number(minutes) || 0));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${remainingMinutes}m`;
}

export function summarizeItems(items = [], maxItems = 3) {
  const names = items.slice(0, maxItems).map((item) => {
    if (typeof item === "string") {
      return item;
    }

    if (item.quantity && item.name) {
      return `${item.quantity}x ${item.name}`;
    }

    return item.name || "Item";
  });

  if (items.length > maxItems) {
    names.push(`+${items.length - maxItems} more`);
  }

  return names.join(", ");
}

export function calculateOrderTotals(items = [], taxRate = 0.08, serviceRate = 0.02) {
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.unit_price ?? item.price ?? 0);
    const quantity = Number(item.quantity ?? item.qty ?? 0);
    return sum + unitPrice * quantity;
  }, 0);

  const taxAmount = subtotal * taxRate;
  const serviceCharge = subtotal * serviceRate;
  const total = subtotal + taxAmount + serviceCharge;

  return {
    subtotal,
    taxAmount,
    serviceCharge,
    total,
  };
}

export function getTableStatusTone(status) {
  const tones = {
    available: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    occupied: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    reserved: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    cleaning: "border-slate-500/20 bg-slate-500/10 text-slate-300",
  };

  return tones[status] || "border-slate-700 bg-slate-800 text-slate-300";
}

export function getOrderStatusTone(status) {
  const tones = {
    active: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    completed: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    dine_in: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    takeaway: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",
    delivery: "border-orange-400/20 bg-orange-400/10 text-orange-300",
    new: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    preparing: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    ready: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    cooking: "border-orange-400/20 bg-orange-400/10 text-orange-300",
    served: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    paid: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    split: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    pending: "border-slate-700 bg-slate-800 text-slate-300",
  };

  return tones[status] || "border-slate-700 bg-slate-800 text-slate-300";
}