import { Link } from 'react-router-dom';
import { mockProducts } from '../utils/mockData';
import ProductCard from './ProductCard';
import { Button } from './ui/button';

function MenuPreview() {
  return (
    <section className="section-shell py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-400">Menu preview</p>
          <h2 className="section-title mt-4">Designed to feel premium before the first sip lands.</h2>
        </div>
        <Link to="/menu">
          <Button variant="secondary">See full menu</Button>
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {mockProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} mode="marketing" />
        ))}
      </div>
    </section>
  );
}

export default MenuPreview;