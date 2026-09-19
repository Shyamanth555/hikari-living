import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RatingStars } from '../common/RatingStars';
import { RatingInput } from '../common/RatingInput';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reviewApi } from '../../api/reviewApi';

function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: 'Please select a star rating', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.create(productId, { rating, title, comment });
      toast({ title: 'Review submitted', description: 'Thanks — it will appear once approved.', variant: 'success' });
      onSubmitted();
    } catch (err) {
      toast({ title: 'Could not submit review', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border p-5">
      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review-title">Title (optional)</Label>
        <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review-comment">Your review</Label>
        <Textarea id="review-comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Review'}
      </Button>
    </form>
  );
}

function WriteReviewPrompt({ productId, onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { data: eligibility, loading, refetch } = useAsync(
    () => (isAuthenticated ? reviewApi.eligibility(productId) : Promise.resolve(null)),
    [productId, isAuthenticated]
  );

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} className="font-medium text-primary hover:underline">
          Log in
        </Link>{' '}
        to write a review.
      </p>
    );
  }

  if (loading) {
    return <Spinner size={20} />;
  }

  if (eligibility?.canReview) {
    return (
      <ReviewForm
        productId={productId}
        onSubmitted={() => {
          refetch();
          onSubmitted();
        }}
      />
    );
  }

  if (eligibility?.reason === 'already_reviewed') {
    return (
      <p className="text-sm text-muted-foreground">
        You&apos;ve already reviewed this product
        {eligibility.existingStatus === 'pending' ? " — it's awaiting approval." : '.'}
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">Only customers who have purchased this product can leave a review.</p>
  );
}

export function ReviewsSection({ productId, ratingAverage, numReviews }) {
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useAsync(() => reviewApi.list(productId, { page, limit: 5 }), [productId, page]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl text-foreground">Customer Reviews</h2>
        {numReviews > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars rating={ratingAverage} />
            <span className="text-sm text-muted-foreground">
              {ratingAverage.toFixed(1)} out of 5 ({numReviews} review{numReviews === 1 ? '' : 's'})
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading && (
            <div className="flex justify-center py-10">
              <Spinner size={24} />
            </div>
          )}

          {!loading && (!data || data.data.length === 0) && (
            <p className="text-sm text-muted-foreground">No reviews yet — be the first to review this product.</p>
          )}

          {!loading && data && data.data.length > 0 && (
            <ul className="space-y-6">
              {data.data.map((review) => (
                <li key={review._id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center gap-3">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-sm font-medium text-foreground">{review.user?.name || 'Customer'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {review.title && <p className="mt-2 text-sm font-medium text-foreground">{review.title}</p>}
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}

          {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} className="mt-8" />}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Write a Review</h3>
          <WriteReviewPrompt productId={productId} onSubmitted={() => { setPage(1); refetch(); }} />
        </div>
      </div>
    </div>
  );
}
