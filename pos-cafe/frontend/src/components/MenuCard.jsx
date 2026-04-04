import { Button } from './ui/Button';
import { formatCurrency } from '../utils/helpers';

function getMenuBadges(item) {
  const name = String(item.name || '').toLowerCase();
  const category = String(item.category || '').toLowerCase();
  const badges = [];

  if (['tea', 'coffee', 'desserts', 'water'].includes(category)) {
    badges.push('Veg');
  }

  if (['tea', 'coffee', 'pizza', 'pasta'].includes(category) || name.includes('hot')) {
    badges.push('Hot');
  }

  if (['pizza', 'burger', 'coffee'].includes(category) || Number(item.price) >= 180) {
    badges.push('Popular');
  }

  return badges.slice(0, 3);
}

function MenuCard({ item, onAdd, actionLabel = 'Add', compact = false }) {
  const isAvailable = item.isAvailable !== false;
  const badges = getMenuBadges(item);

  return (
    <article className="group overflow-hidden rounded-xl border border-[#374151] bg-[#111827] shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl">
      <div className={`${compact ? 'aspect-[4/3]' : 'aspect-[5/4]'} relative overflow-hidden bg-[#0B1220]`}>
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/25 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-[#111827]/90 px-3 py-1 text-sm text-[#F9FAFB]">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#F9FAFB]">{item.name}</h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">{formatCurrency(item.price)}</p>
          </div>
          <span className="rounded-full border border-[#374151] bg-[#0B1220] px-3 py-1 text-sm text-[#9CA3AF]">
            {item.category}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm ${isAvailable ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isAvailable ? 'Available now' : 'Currently unavailable'}
          </p>
          <Button
            type="button"
            className="h-10 rounded-lg bg-[#F59E0B] px-4 text-sm text-black hover:brightness-110"
            disabled={!isAvailable}
            onClick={() => onAdd?.(item)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default MenuCard;