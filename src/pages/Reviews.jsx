import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { EmptyState } from '../components/common/EmptyState';
import { ReviewCard } from '../components/review/ReviewCard';
import { ReviewDetailDialog } from '../components/review/ReviewDetailDialog';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { reviewApi } from '../api/reviewApi';

const PAGE_SIZE = 12;

export default function Reviews() {
  const [page, setPage] = useState(1);
  const [openReview, setOpenReview] = useState(null);
  const { data, loading } = useAsync(() => reviewApi.listAll({ page, limit: PAGE_SIZE }), [page]);

  const changePage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-page py-14">
      <SEO title="Reviews" description="What customers say about Hikari Living sculptures." />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl text-foreground">What Our Customers Say</h1>
        <p className="mt-3 text-muted-foreground">
          Every review here is from a customer who bought the piece from us.
          {data?.total > 0 && ` ${data.total} review${data.total === 1 ? '' : 's'} so far.`}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      )}

      {!loading && data?.data.length === 0 && (
        <EmptyState
          icon={MessageSquareText}
          title="No reviews yet"
          description="Reviews from our customers will appear here once they're published."
        />
      )}

      {!loading && data?.data.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((review) => (
            <ReviewCard key={review._id} review={review} onOpen={() => setOpenReview(review)} />
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} pages={data.pages} onPageChange={changePage} className="mt-10" />}

      <ReviewDetailDialog review={openReview} onClose={() => setOpenReview(null)} />
    </div>
  );
}
