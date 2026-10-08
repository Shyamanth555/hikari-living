import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const PX_PER_SECOND = 32;

// A continuously-sliding marquee (like the old CSS animation) that the user
// can also grab and drag/swipe by hand. Both are driven from the same
// requestAnimationFrame loop over a plain translateX offset — dragging just
// pauses the auto-advance and moves the offset directly, so there's no
// fighting between "smooth auto-slide" and "user control". The set is
// repeated enough times to cover the visible width plus one more set, so the
// loop wraps seamlessly with no visible jump or empty gap — even with only a
// few categories on a wide screen. Since positioning is via transform (not
// native scroll), there's no scrollbar to hide.
export function CategoryCarousel({ categories }) {
  const [copies, setCopies] = useState(2);
  const items = Array.from({ length: copies }, () => categories).flat();

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  // One set's width is measured from the first card to the first card of the
  // next copy, so it includes the gap between sets. Re-measured on resize,
  // since card widths change at the sm breakpoint.
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || categories.length === 0) return;

    const measure = () => {
      const nextSetStart = track.children[categories.length];
      if (!nextSetStart) return;
      const setWidth = nextSetStart.offsetLeft - track.children[0].offsetLeft;
      if (setWidth <= 0) return;
      singleSetWidthRef.current = setWidth;
      offsetRef.current %= setWidth;
      // Enough sets to fill the width, +1 for the set the loop scrolls through,
      // +1 more since the track ends a gap short of a whole number of sets.
      setCopies(Math.ceil(container.clientWidth / setWidth) + 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [categories.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || categories.length === 0) return;

    const wrap = (value) => {
      const w = singleSetWidthRef.current;
      if (w <= 0) return 0;
      let v = value % w;
      if (v < 0) v += w;
      return v;
    };

    const applyTransform = () => {
      track.style.transform = `translateX(-${offsetRef.current}px)`;
    };

    const tick = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const deltaSeconds = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!draggingRef.current) {
        offsetRef.current = wrap(offsetRef.current + PX_PER_SECOND * deltaSeconds);
        applyTransform();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [categories.length]);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const delta = dragStartXRef.current - e.clientX;
    const w = singleSetWidthRef.current;
    let next = dragStartOffsetRef.current + delta;
    if (w > 0) {
      next = ((next % w) + w) % w;
    }
    offsetRef.current = next;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${next}px)`;
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
    >
      <div
        ref={trackRef}
        className="flex w-max cursor-grab touch-pan-y select-none gap-5 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((cat, i) => (
          <Link
            key={`${cat._id}-${i}`}
            to={`/category/${cat.slug}`}
            draggable={false}
            className="group w-40 shrink-0 text-center sm:w-48"
            tabIndex={i >= categories.length ? -1 : 0}
            aria-hidden={i >= categories.length}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-cream-200">
              <img
                src={cat.image?.url}
                alt={cat.name}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2.5 text-sm font-medium text-foreground">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
