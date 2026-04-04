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
          ? 'border-primary/20 bg-primary/10 text-primary'
          : 'border-green-500/20 bg-green-500/10 text-green-300';

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!isAvailable}
      className="group relative h-[168px] overflow-hidden rounded-xl border border-slate-800 bg-card text-left shadow-md transition hover:-translate-y-0.5 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <img src={product.imageUrl} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/72 to-background/10 pointer-events-none" />

      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className="rounded-full border border-slate-800 bg-card/90 px-2.5 py-1 text-[11px] tracking-[0.14em] text-white">
            {product.category}
          </Badge>
          <Badge className={`rounded-full border px-2.5 py-1 text-[11px] tracking-[0.14em] ${badgeTone}`}>
            {product.status}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <p className="line-clamp-2 text-lg font-semibold text-white">{product.name}</p>
          <p className="text-sm font-medium text-primary">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </button>
  );
}

export default ProductTile;