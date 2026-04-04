import { Badge } from './ui/Badge';
import { formatCurrency } from '../utils/helpers';

function ProductTile({ product, onAdd }) {
  const isAvailable = product.status !== 'Sold out';

  const badgeTone =
    product.status === 'Sold out'
      ? 'border-red-500/20 bg-red-500/10 text-red-300'
      : product.status === 'Low stock'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
        : product.status === 'Hot'
          ? 'border-teal-500/20 bg-teal-500/10 text-teal-300'
          : 'border-teal-500/20 bg-teal-500/10 text-teal-300';

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!isAvailable}
      className="group relative h-[168px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111827] text-left shadow-[0_20px_45px_rgba(2,6,23,0.35)] transition hover:-translate-y-0.5 hover:border-amber-400/30 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <img src={product.imageUrl} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/72 to-[#0B1220]/10" />

      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className="rounded-full border border-white/10 bg-[#111827]/90 px-2.5 py-1 text-[11px] tracking-[0.14em] text-slate-100">
            {product.category}
          </Badge>
          <Badge className={`rounded-full border px-2.5 py-1 text-[11px] tracking-[0.14em] ${badgeTone}`}>
            {product.status}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <p className="line-clamp-2 text-lg font-semibold text-slate-100">{product.name}</p>
          <p className="text-sm font-medium text-amber-400">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </button>
  );
}

export default ProductTile;