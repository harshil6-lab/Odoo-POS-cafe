import { cn } from '../../utils/helpers';

function Card({ className, ...props }) {
  return <div className={cn('panel', className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div className={cn('space-y-2 p-6', className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-xl font-semibold text-white', className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-slate-400', className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };