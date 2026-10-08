import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { ReviewPhotos } from './ReviewPhotos';

/**
 * A review on the home page / Reviews page. The whole card opens the review
 * (an invisible button stretched over it); the product link and photos sit
 * above that button, so they do their own thing instead.
 */
export function ReviewCard({ review, onOpen }) {
  const { customer, product } = review;

  return (
    <article className="relative flex h-full flex-col rounded-lg border border-border bg-cream-50 p-6 transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Read the full review by ${customer.name}`}
      />

      {product && (
        <Link
          to={`/product/${product.slug}`}
          className="relative z-10 flex items-center gap-3 self-start rounded-md pr-1 hover:underline"
        >
          {product.image && <img src={product.image} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />}
          <span className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</span>
        </Link>
      )}

      <RatingStars rating={review.rating} className={product ? 'mt-4' : undefined} />
      {review.title && <p className="mt-3 text-sm font-medium text-foreground">{review.title}</p>}
      <p className="mt-2 line-clamp-4 text-sm text-foreground">&ldquo;{review.comment}&rdquo;</p>

      <ReviewPhotos images={review.images} size="sm" className="relative z-10 mt-4 self-start" />

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <p className="text-sm font-medium text-foreground">
            {customer.name}
            {customer.city && <span className="font-normal text-muted-foreground"> — {customer.city}</span>}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-pine-600">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-primary">Read review →</span>
      </div>
    </article>
  );
}
