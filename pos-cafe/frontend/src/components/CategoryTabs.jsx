import { Button } from './ui/Button';

function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl bg-slate-950 p-1">
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={activeCategory === category ? 'default' : 'ghost'}
          className={`h-10 rounded-xl px-4 text-xs font-semibold uppercase tracking-[0.18em] ${
            activeCategory === category ? 'text-slate-950' : 'text-slate-300 hover:bg-slate-800'
          }`}
          onClick={() => onChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

export default CategoryTabs;