import ProductCard from './ProductCard';

function ProductGrid({ products, onAdd }) {
  if (!products.length) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/60 p-4 text-center text-sm text-slate-400">
        No products match this filter.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default ProductGrid;