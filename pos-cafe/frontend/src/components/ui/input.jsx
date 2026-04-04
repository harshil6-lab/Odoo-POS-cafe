import { cn } from '../../utils/helpers';

function Input({ className, ...props }) {
  return <input className={cn('input', className)} {...props} />;
}

export { Input };