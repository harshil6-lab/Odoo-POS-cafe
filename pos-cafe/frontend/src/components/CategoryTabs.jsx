import { Button } from './ui/Button';

function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111827] p-1.5">
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={activeCategory === category ? 'default' : 'ghost'}
          className={`h-10 rounded-xl px-4 text-sm ${
            activeCategory === category ? 'text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
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