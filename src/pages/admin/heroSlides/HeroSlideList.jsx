import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { DataTable } from '../../../components/admin/DataTable';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { useAsync } from '../../../hooks/useAsync';
import { heroSlideApi } from '../../../api/heroSlideApi';
import { useToast } from '../../../context/ToastContext';

export default function HeroSlideList() {
  const { data: slides, loading, refetch } = useAsync(() => heroSlideApi.adminList(), []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await heroSlideApi.adminDelete(deleteTarget._id);
      toast({ title: 'Slide deleted', variant: 'success' });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast({ title: 'Could not delete slide', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Slide',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image?.url} alt="" className="h-10 w-16 rounded object-cover" />
          <span className="font-medium text-foreground">{row.heading || '—'}</span>
        </div>
      ),
    },
    { key: 'product', label: 'Links to', render: (row) => row.product?.name || <span className="text-destructive">Product deleted</span> },
    { key: 'sortOrder', label: 'Sort order' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'accent' : 'neutral'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/hero-slides/${row._id}/edit`)}
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
        <h1 className="font-display text-2xl text-foreground">Home Page Hero</h1>
        <Button asChild>
          <Link to="/admin/hero-slides/new">
            <Plus className="h-4 w-4" /> Add Slide
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={slides || []}
        loading={loading}
        page={1}
        pages={1}
        onPageChange={() => {}}
        emptyMessage="No hero slides yet — the homepage will show a default banner until you add one"
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete slide</DialogTitle>
            <DialogDescription>Are you sure you want to delete this hero slide? This cannot be undone.</DialogDescription>
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
