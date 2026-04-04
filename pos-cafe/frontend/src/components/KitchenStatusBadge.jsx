const STATUS_STYLES = {
  pending: 'border-slate-500/20 bg-slate-500/10 text-slate-300',
  preparing: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
  cooking: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
  ready: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  served: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
};

function formatStatus(status) {
  const normalized = String(status || 'pending').toLowerCase();
  return normalized ? `${normalized[0].toUpperCase()}${normalized.slice(1)}` : 'Pending';
}

function KitchenStatusBadge({ status, className = '' }) {
  const normalized = String(status || 'pending').toLowerCase();
  const tone = STATUS_STYLES[normalized] || STATUS_STYLES.pending;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${tone} ${className}`.trim()}>
      {formatStatus(normalized)}
    </span>
  );
}

export const KITCHEN_ORDER_STATUSES = ['pending', 'preparing', 'cooking', 'ready', 'served'];

export function getKitchenStatusStep(status) {
  const normalized = String(status || 'pending').toLowerCase();
  return Math.max(0, KITCHEN_ORDER_STATUSES.indexOf(normalized));
}

export default KitchenStatusBadge;