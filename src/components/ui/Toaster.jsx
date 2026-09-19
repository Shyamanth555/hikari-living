import { CheckCircle2, X, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Toaster({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-lg bg-cream-50',
            t.variant === 'destructive' && 'border-destructive/30',
            t.variant === 'success' && 'border-pine-500/30',
            t.variant === 'default' && 'border-border'
          )}
        >
          {t.variant === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pine-500" />}
          {t.variant === 'destructive' && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
          <div className="flex-1 text-sm">
            {t.title && <p className="font-medium text-foreground">{t.title}</p>}
            {t.description && <p className="text-muted-foreground">{t.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
