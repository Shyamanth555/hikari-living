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
            src="/ourStory.png"
            alt="Hikari Living workshop"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>
            {BRAND_NAME} began with a simple idea: that sculptures and idols carry meaning, and deserve to be
            made with the same care and skill as any fine craft — not mass-produced, but shaped by hand.
          </p>
          <p>
            We work with experienced artisans across India who specialise in brass casting, panchaloha work,
            marble carving, and woodwork — from home temple centrepieces in our Divine Series, to compact
            idols sized for a car dashboard, to statues honouring the figures of Pride of India.
          </p>
          <p>
            Every piece is finished by hand and checked before it leaves the workshop. When something specific
            is in mind — a particular deity, size, or material — our artisans also take on custom
            commissions.
          </p>
        </div>
      </div>
    </div>
  );
}
