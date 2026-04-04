import { Button } from './ui/Button';
import { formatCurrency } from '../utils/helpers';
import VegNonVegIcon from './ui/VegNonVegIcon';
import { Plus } from 'lucide-react';

function isVeg(item) {
  const category = String(item.category || '').toLowerCase();
  return ['tea', 'coffee', 'desserts', 'water', 'veg starters', 'main course (veg)'].includes(category);
}

function MenuCard({ item, onAdd, actionLabel = 'Add', compact = false }) {
  const isAvailable = item.isAvailable !== false;
  const veg = isVeg(item);

  return (
    <article className="group overflow-hidden rounded-xl bg-card shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} relative`}>
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <p className="text-sm text-text-secondary">{item.category}</p>
        </div>
        <div className="absolute right-4 top-4">
          <VegNonVegIcon isVeg={veg} />
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
          {formatCurrency(item.price)}
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-text-secondary mb-4">{item.description || 'A delicious item from our menu.'}</p>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-bold ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </p>
          <Button
            type="button"
            size="sm"
            className="bg-primary text-white hover:bg-primary/90"
            disabled={!isAvailable}
            onClick={() => onAdd?.(item)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default MenuCard;