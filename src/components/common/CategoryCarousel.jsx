import { Link } from 'react-router-dom';

export function CategoryCarousel({ categories }) {
  // Track is duplicated so the loop is seamless — at -50% translateX the second
  // copy lines up exactly where the first one started.
  const items = [...categories, ...categories];

  return (
    <div className="group/carousel overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max animate-marquee gap-5 group-hover/carousel:[animation-play-state:paused]">
        {items.map((cat, i) => (
          <Link
            key={`${cat._id}-${i}`}
            to={`/category/${cat.slug}`}
            className="group w-40 shrink-0 text-center sm:w-48"
            tabIndex={i >= categories.length ? -1 : 0}
            aria-hidden={i >= categories.length}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-cream-200">
              <img
                src={cat.image?.url}
                alt={cat.name}
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
