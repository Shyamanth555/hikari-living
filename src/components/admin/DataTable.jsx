import { Pagination } from '../ui/Pagination';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Inbox } from 'lucide-react';

/**
 * Generic admin list. Renders as a table on tablet/desktop and as stacked
 * cards on mobile (a table is unreadable at phone width), reusing the same
 * column render functions either way. The first column becomes each card's
 * title, a column keyed "actions" floats to the card's top-right corner, and
 * every other column becomes a label/value row.
 * @param {{key:string,label:string,render?:(row)=>React.ReactNode}[]} columns
 */
export function DataTable({ columns, rows, loading, page, pages, onPageChange, emptyMessage = 'No records found' }) {
  const [titleColumn, ...restColumns] = columns;
  const actionsColumn = restColumns.find((c) => c.key === 'actions');
  const detailColumns = restColumns.filter((c) => c.key !== 'actions');

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Tablet / desktop */}
      <div className="hidden max-h-[60vh] overflow-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-cream-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              rows.map((row) => (
                <tr key={row._id} className="border-b border-border last:border-0 hover:bg-cream-50">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="max-h-[60vh] divide-y divide-border overflow-auto md:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}

        {!loading &&
          rows.map((row) => (
            <div key={row._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-sm">
                  {titleColumn.render ? titleColumn.render(row) : row[titleColumn.key]}
                </div>
                {actionsColumn && <div className="shrink-0">{actionsColumn.render(row)}</div>}
              </div>
              {detailColumns.length > 0 && (
                <dl className="mt-3 space-y-1.5">
                  {detailColumns.map((col) => (
                    <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                      <dt className="shrink-0 text-muted-foreground">{col.label}</dt>
                      <dd className="min-w-0 text-right text-foreground">{col.render ? col.render(row) : row[col.key]}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ))}
      </div>

      {!loading && rows.length === 0 && <EmptyState icon={Inbox} title={emptyMessage} />}

      {pages > 1 && (
        <div className="border-t border-border p-4">
          <Pagination page={page} pages={pages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
