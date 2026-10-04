import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-foreground',
        accent: 'bg-pine-50 text-pine-600',
        gold: 'bg-gold-50 text-gold-600',
        warning: 'bg-amber-50 text-amber-700',
        destructive: 'bg-red-50 text-destructive',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
