import { Plus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

function ProductCard({ product, onAdd, mode = 'admin' }) {
  return (
    <div className="panel overflow-hidden">
      <div className={`h-36 bg-gradient-to-br ${product.imageTone || 'from-brand-500/30 via-amber-500/10 to-slate-900'}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.category?.name || product.categoryName || 'Menu Item'}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{product.name}</h3>
          </div>
          <p className="text-sm font-semibold text-brand-300">{formatCurrency(product.price)}</p>
        </div>

        <p className="mt-3 text-sm text-slate-400">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(product.variants || []).map((variant) => (
            <Badge key={variant}>{variant}</Badge>
          ))}
        </div>

        {mode === 'admin' ? (
          <Button type="button" className="mt-5 w-full" onClick={() => onAdd?.(product)}>
            <Plus className="h-4 w-4" />
            Add to order
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ProductCard;