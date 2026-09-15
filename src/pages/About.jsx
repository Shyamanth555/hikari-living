import { SEO } from '../components/common/SEO';
import { BRAND_NAME } from '../lib/constants';

export default function About() {
  return (
    <div className="container-page py-14">
      <SEO title="About / Our Story" description={`The story behind ${BRAND_NAME}.`} />

      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Our Story</h1>
        <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-cream-200">
          <img
            src="https://picsum.photos/seed/hikari-about/1200/675"
            alt="Hikari Living workshop"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>
            {BRAND_NAME} began with a simple idea: that the objects we live with every day should be made
            with care, from materials that age gracefully, and designed to be kept rather than replaced.
          </p>
          <p>
            We work with small workshops and independent makers who share that philosophy — hand-thrown
            ceramics, solid hardwood furniture, and naturally dyed textiles, each piece chosen for how it
            will look and feel years from now, not just on the day it arrives.
          </p>
          <p>
            Every collection is edited carefully rather than expanded for its own sake. We would rather
            offer fewer, better things than everything at once — a quieter way to furnish a home.
          </p>
        </div>
      </div>
    </div>
  );
}
