import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

// Builds a compact page list like [1, '…', 4, 5, 6, '…', 12]
function buildPageList(page, pages) {
  const list = [];
  const add = (v) => list.push(v);

  const windowSize = 1;
  const start = Math.max(2, page - windowSize);
  const end = Math.min(pages - 1, page + windowSize);

  add(1);
  if (start > 2) add('…');
  for (let p = start; p <= end; p += 1) add(p);
  if (end < pages - 1) add('…');
  if (pages > 1) add(pages);

  return list;
}

export function Pagination({ page, pages, onPageChange, className }) {
  if (pages <= 1) return null;

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {buildPageList(page, pages).map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'outline'}
            size="icon"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
