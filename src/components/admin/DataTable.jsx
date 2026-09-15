import { Pagination } from '../ui/Pagination';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Inbox } from 'lucide-react';

/**
 * Generic admin list table.
 * @param {{key:string,label:string,render?:(row)=>React.ReactNode}[]} columns
 */
export function DataTable({ columns, rows, loading, page, pages, onPageChange, emptyMessage = 'No records found' }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-100">
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

      {!loading && rows.length === 0 && <EmptyState icon={Inbox} title={emptyMessage} />}

      {pages > 1 && (
        <div className="border-t border-border p-4">
          <Pagination page={page} pages={pages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
