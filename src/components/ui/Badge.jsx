import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-foreground',
        accent: 'bg-sage-50 text-sage-600',
        clay: 'bg-clay-50 text-clay-600',
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
