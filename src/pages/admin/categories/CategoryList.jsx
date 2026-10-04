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
import { categoryApi } from '../../../api/categoryApi';
import { useToast } from '../../../context/ToastContext';

export default function CategoryList() {
  const { data: categories, loading, refetch } = useAsync(() => categoryApi.adminList(), []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await categoryApi.adminDelete(deleteTarget._id);
      toast({ title: 'Category deleted', variant: 'success' });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast({ title: 'Could not delete category', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image?.url} alt="" className="h-10 w-10 rounded object-cover" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
    },
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
            onClick={() => navigate(`/admin/categories/${row._id}/edit`)}
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
        <h1 className="font-display text-2xl text-foreground">Categories</h1>
        <Button asChild className="ml-auto">
          <Link to="/admin/categories/new">
            <Plus className="h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={categories || []}
        loading={loading}
        page={1}
        pages={1}
        onPageChange={() => {}}
        emptyMessage="No categories yet"
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? Categories with products
              assigned cannot be deleted.
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
