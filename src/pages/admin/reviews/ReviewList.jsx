import { useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { DataTable } from '../../../components/admin/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { RatingStars } from '../../../components/common/RatingStars';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { useAsync } from '../../../hooks/useAsync';
import { reviewApi } from '../../../api/reviewApi';
import { useToast } from '../../../context/ToastContext';

const STATUS_VARIANT = { pending: 'gold', approved: 'accent', rejected: 'destructive' };

export default function ReviewList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('pending');
  const { data, loading, refetch } = useAsync(
    () => reviewApi.adminList({ page, limit: 15, status: status === 'all' ? undefined : status }),
    [page, status]
  );
  const { toast } = useToast();

  const handleStatus = async (id, newStatus) => {
    try {
      await reviewApi.adminUpdateStatus(id, newStatus);
      toast({ title: `Review ${newStatus}`, variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Could not update review', description: err?.response?.data?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewApi.adminDelete(id);
      toast({ title: 'Review deleted', variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Could not delete review', description: err?.response?.data?.message, variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (row) => <span className="font-medium text-foreground">{row.product?.name || 'Deleted product'}</span>,
    },
    { key: 'user', label: 'Customer', render: (row) => row.user?.name },
    { key: 'rating', label: 'Rating', render: (row) => <RatingStars rating={row.rating} size="sm" /> },
    { key: 'comment', label: 'Review', render: (row) => <span className="line-clamp-2 max-w-xs">{row.comment}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.status !== 'approved' && (
            <button
              type="button"
              onClick={() => handleStatus(row._id, 'approved')}
              className="text-muted-foreground hover:text-pine-500 cursor-pointer"
              aria-label="Approve"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {row.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => handleStatus(row._id, 'rejected')}
              className="text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label="Reject"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
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
        <h1 className="font-display text-2xl text-foreground">Reviews</h1>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={loading}
        page={data?.page || 1}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No reviews here"
      />
    </div>
  );
}
