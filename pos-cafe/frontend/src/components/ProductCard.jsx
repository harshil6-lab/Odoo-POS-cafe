import { ImageIcon, Plus } from 'lucide-react';
import { Badge } from './ui/Badge';
import { formatCurrency } from '../utils/helpers';

function ProductCard({ product, onAdd }) {
  const isAvailable = product.status !== 'Sold out';

  const badgeTone =
    product.status === 'Sold out'
      ? 'border-red-500/20 bg-red-500/10 text-red-300'
      : product.status === 'Low stock'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
        : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 transition hover:border-amber-500/20 hover:bg-slate-900">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-32 w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-32 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))]">
            <ImageIcon className="h-10 w-10 text-slate-600" />
          </div>
        )}
        <div className="absolute left-2 top-2 rounded-lg border border-slate-800 bg-slate-950/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          {product.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-1 pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[15px] font-semibold text-white">{product.name}</h3>
            <p className="mt-1 text-lg font-semibold text-amber-400">{formatCurrency(product.price)}</p>
          </div>
          <Badge className={`rounded-lg border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${badgeTone}`}>
            {product.status}
          </Badge>
        </div>

        <button
          type="button"
          className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl bg-amber-500 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          onClick={() => onAdd(product)}
          disabled={!isAvailable}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add item
        </button>
      </div>
    </div>
  );
}

export default ProductCard;