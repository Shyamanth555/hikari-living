import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { FlashSaleBadge } from './FlashSaleBadge';
import { SaleCountdown } from './SaleCountdown';
import { useNow } from '../../hooks/useNow';
import { cn } from '../../lib/cn';
import { formatCurrency } from '../../lib/formatCurrency';
import { formatSaleTime, getSaleStatus } from '../../lib/pricing';

const LOW_STOCK_THRESHOLD = 10;
const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

function FlashSaleSlide({ product, live, now }) {
  const { percentOff, startsAt, endsAt } = product.sale;
  const soldOut = product.stock <= 0;
  const productUrl = `/product/${product.slug}`;

  return (
    <div className="mx-auto grid h-full max-w-5xl content-center items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12 lg:gap-16">
      <Link to={productUrl} className="group relative mx-auto block w-full max-w-xs sm:max-w-sm md:max-w-none">
        <div className="aspect-square overflow-hidden rounded-xl bg-cream-200 shadow-xl ring-1 ring-border">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute -right-3 -top-3 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full bg-sale text-sale-foreground shadow-lg ring-4 ring-cream-100 md:h-24 md:w-24">
          <span className="font-display text-2xl leading-none md:text-3xl">{percentOff}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">off</span>
        </div>
      </Link>

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <FlashSaleBadge live={live} />

        <p className="mt-5 font-display text-5xl leading-none text-foreground lg:text-7xl">
          Flat <span className="text-sale">{percentOff}% off</span>
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
          <Link to={productUrl} className="hover:underline">
            {product.name}
          </Link>
        </h2>
        {product.shortDescription && (
          <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">{product.shortDescription}</p>
        )}

        <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 md:justify-start">
          <span className="font-display text-3xl text-foreground md:text-4xl">{formatCurrency(product.salePrice)}</span>
          <span className="text-lg text-destructive line-through decoration-muted-foreground decoration-2">{formatCurrency(product.price)}</span>
          <span className="rounded-full bg-pine-50 px-2.5 py-0.5 text-sm font-medium text-pine-600">
            Save {formatCurrency(product.price - product.salePrice)}
          </span>
        </div>

        <SaleCountdown sale={product.sale} live={live} now={now} size="lg" className="mt-7" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
          {live && soldOut ? (
            <Button size="lg" variant="outline" disabled>
              Sold out
            </Button>
          ) : (
            <Button asChild size="lg" variant={live ? 'accent' : 'outline'}>
              <Link to={productUrl}>
                {live ? `Buy now at ${formatCurrency(product.salePrice)}` : 'View product'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {live && !soldOut && product.stock <= LOW_STOCK_THRESHOLD && (
            <p className="text-sm font-medium text-sale">Hurry — only {product.stock} left</p>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Offer valid {formatSaleTime(startsAt)} – {formatSaleTime(endsAt)} · While stocks last
        </p>
      </div>
    </div>
  );
}

/**
 * Home page hero for flash sales — one slide per live or upcoming sale, live
 * ones first. Each counts down to its start, then to its end, and drops out
 * once over. `products` come from /products/flash-sale, oldest start first.
 */
export function FlashSaleHero({ products }) {
  const now = useNow();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const dragStartX = useRef(null);
  const didSwipe = useRef(false);

  const slides = products
    .map((product) => ({ product, status: getSaleStatus(product, now) }))
    .filter(({ status }) => status === 'live' || status === 'upcoming')
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'live' ? -1 : 1));
  const count = slides.length;
  // Sales drop out as they end, so the stored index can outrun the list.
  const active = count > 0 ? index % count : 0;

  // Paused while hovered, and while focus is inside so a keyboard user's
  // focused link isn't faded out (and made inert) under them.
  const paused = hovered || focused;

  // Restarts on every slide change, so a swipe gets the full interval.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, count, paused]);

  if (count === 0) return null;

  const goTo = (i) => setIndex((i + count) % count);

  // Pointer events cover both a finger swipe and a mouse drag.
  const handlePointerDown = (e) => {
    if (count <= 1 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragStartX.current = e.clientX;
    didSwipe.current = false;
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      goTo(active + (diff > 0 ? 1 : -1));
      didSwipe.current = true;
    }
    dragStartX.current = null;
  };

  // A mouse drag that ends over a link shouldn't also follow it.
  const handleClickCapture = (e) => {
    if (!didSwipe.current) return;
    e.preventDefault();
    e.stopPropagation();
    didSwipe.current = false;
  };

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-cream-100"
      aria-label="Flash sales"
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-300/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-pine-300/30 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-sale/10 blur-3xl" />
      </div>

      {/* Slides share one grid cell and cross-fade, so the hero keeps the tallest
          slide's height instead of jumping as they change. Content is capped and
          centred (inside FlashSaleSlide) so wide screens don't leave a gap on one side. */}
      <div className="container-page relative py-10 md:py-14">
        {/* touch-pan-y leaves vertical scrolling to the browser and hands horizontal
            swipes to the pointer handlers; native image/link dragging is blocked so
            a mouse drag swipes instead. */}
        <div
          className={cn('grid touch-pan-y', count > 1 && 'cursor-grab select-none active:cursor-grabbing')}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (dragStartX.current = null)}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          {slides.map(({ product, status }, i) => (
            <div
              key={product._id}
              role={count > 1 ? 'group' : undefined}
              aria-roledescription={count > 1 ? 'slide' : undefined}
              aria-label={count > 1 ? `${i + 1} of ${count}` : undefined}
              inert={i !== active}
              className={cn(
                'col-start-1 row-start-1 transition-opacity duration-700 ease-in-out',
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <FlashSaleSlide product={product} live={status === 'live'} now={now} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
