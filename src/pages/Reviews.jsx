import { SEO } from '../components/common/SEO';
import { RatingStars } from '../components/common/RatingStars';
import { TESTIMONIALS } from '../lib/testimonials';

export default function Reviews() {
  return (
    <div className="container-page py-14">
      <SEO title="Reviews" description="What customers say about Hikari Living sculptures." />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl text-foreground">What Our Customers Say</h1>
        <p className="mt-3 text-muted-foreground">
          Real feedback from people who&apos;ve brought a Hikari Living piece into their home, car, or office.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-lg border border-border bg-cream-50 p-6">
            <RatingStars rating={t.rating} />
            <p className="mt-3 text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-foreground">
              {t.name} <span className="font-normal text-muted-foreground">— {t.location}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
