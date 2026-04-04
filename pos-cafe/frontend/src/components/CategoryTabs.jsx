import { Button } from './ui/Button';

function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-background p-1.5">
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={activeCategory === category ? 'default' : 'ghost'}
          className={`h-10 rounded-lg px-4 text-sm ${
            activeCategory === category ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-800 hover:text-white'
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