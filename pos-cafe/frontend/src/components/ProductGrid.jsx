import ProductTile from './ProductTile';

function ProductGrid({ products, onAdd }) {
  if (!products.length) {
    return (
      <div className="flex min-h-[420px] items-center justify-center p-4 text-center text-sm text-slate-400">
        No products match this filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 p-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductTile key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default ProductGrid;