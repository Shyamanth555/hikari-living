import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-md border border-border bg-cream-50 px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
