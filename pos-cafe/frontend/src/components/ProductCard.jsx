import { formatCurrency } from '../utils/helpers';

function ProductCard({ product, onAdd }) {
  return (
    <div className="panel overflow-hidden">
      <div className="h-28 bg-gradient-to-br from-brand-100 via-amber-50 to-white" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.category?.name || 'Menu Item'}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h3>
          </div>
          <p className="text-sm font-semibold text-brand-700">{formatCurrency(product.price)}</p>
        </div>

        <p className="mt-3 text-sm text-slate-500">SKU: {product.sku || 'Not assigned'}</p>

        <button type="button" className="btn-primary mt-5 w-full" onClick={() => onAdd(product)}>
          Add to order
        </button>
      </div>
    </div>
  );
}

export default ProductCard;