import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../utils/helpers';

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn('inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2', className)} {...props} />;
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition data-[state=active]:bg-brand-500 data-[state=active]:text-slate-950',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-6', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };