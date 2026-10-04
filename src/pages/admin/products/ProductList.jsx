import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { DataTable } from '../../../components/admin/DataTable';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StockBadge } from '../../../components/common/StockBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { useAsync } from '../../../hooks/useAsync';
import { useDebounce } from '../../../hooks/useDebounce';
import { productApi } from '../../../api/productApi';
import { useToast } from '../../../context/ToastContext';
import { formatCurrency } from '../../../lib/formatCurrency';

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, loading, refetch } = useAsync(
    () => productApi.adminList({ page, limit: 15, search: debouncedSearch || undefined }),
    [page, debouncedSearch]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productApi.adminDelete(deleteTarget._id);
      toast({ title: 'Product deleted', variant: 'success' });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast({ title: 'Could not delete product', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.images?.[0]?.url} alt="" className="h-10 w-10 rounded object-cover" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (row) => row.category?.name },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
    { key: 'stock', label: 'Stock', render: (row) => <StockBadge stock={row.stock} /> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'active' ? 'accent' : 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/products/${row._id}/edit`)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Edit"
          >
            <SquarePen className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="text-muted-foreground hover:text-destructive cursor-pointer"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-foreground">Products</h1>
        <Button asChild className="ml-auto">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-10 w-full rounded-md border border-border bg-cream-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={loading}
        page={data?.page || 1}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No products yet"
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
