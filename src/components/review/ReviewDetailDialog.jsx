import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { RatingStars } from '../common/RatingStars';
import { ReviewPhotos } from './ReviewPhotos';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// One review in full — whole comment, every photo, and a way on to the product.
// Open while `review` is set.
export function ReviewDetailDialog({ review, onClose }) {
  return (
    <Dialog open={Boolean(review)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        {review && (
          <>
            <DialogHeader>
              <RatingStars rating={review.rating} />
              <DialogTitle className="pt-2 pr-6">{review.title || `Review by ${review.customer.name}`}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  {review.customer.name}
                  {review.customer.city && ` — ${review.customer.city}`} · {formatDate(review.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1 text-pine-600">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                </span>
              </DialogDescription>
            </DialogHeader>

            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{review.comment}</p>

            {review.images?.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer photos
                </p>
                <ReviewPhotos images={review.images} size="md" />
              </div>
            )}

            {review.product && (
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg bg-background-soft p-3">
                {review.product.image && (
                  <img src={review.product.image} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
                )}
                {/* basis-40 makes the button wrap below on narrow screens instead of squeezing the name. */}
                <div className="min-w-0 flex-1 basis-40">
                  <p className="text-xs text-muted-foreground">Reviewed product</p>
                  <p className="line-clamp-2 text-sm font-medium text-foreground">{review.product.name}</p>
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto">
                  <Link to={`/product/${review.product.slug}`}>
                    View product <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
