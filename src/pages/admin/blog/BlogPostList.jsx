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
import { blogApi } from '../../../api/blogApi';
import { useToast } from '../../../context/ToastContext';

export default function BlogPostList() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, loading, refetch } = useAsync(() => blogApi.adminList({ page, limit: 15 }), [page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await blogApi.adminDelete(deleteTarget._id);
      toast({ title: 'Post deleted', variant: 'success' });
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast({ title: 'Could not delete post', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Post',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage?.url && <img src={row.coverImage.url} alt="" className="h-10 w-10 rounded object-cover" />}
          <span className="font-medium text-foreground">{row.title}</span>
        </div>
      ),
    },
    { key: 'author', label: 'Author' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'published' ? 'accent' : 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/blog/${row._id}/edit`)}
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
        <h1 className="font-display text-2xl text-foreground">Blog Posts</h1>
        <Button asChild className="ml-auto">
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={loading}
        page={data?.page || 1}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No posts yet"
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This cannot be undone.
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
