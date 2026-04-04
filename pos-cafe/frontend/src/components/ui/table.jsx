import { cn } from '../../utils/helpers';

function Table({ className, ...props }) {
  return <table className={cn('min-w-full text-left text-sm text-slate-300', className)} {...props} />;
}

function TableHeader({ className, ...props }) {
  return <thead className={cn('border-b border-white/10 text-slate-500', className)} {...props} />;
}

function TableBody({ className, ...props }) {
  return <tbody className={cn('divide-y divide-white/5', className)} {...props} />;
}

function TableRow({ className, ...props }) {
  return <tr className={cn('transition hover:bg-white/5', className)} {...props} />;
}

function TableHead({ className, ...props }) {
  return <th className={cn('px-4 py-3 font-medium', className)} {...props} />;
}

function TableCell({ className, ...props }) {
  return <td className={cn('px-4 py-4 align-middle', className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };