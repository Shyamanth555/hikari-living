import { Link } from 'react-router-dom';
import { SocialIcon } from '../common/SocialIcon';
import { BRAND_NAME, POLICY_LINKS, SOCIAL_LINKS } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <h2 className="font-display text-xl text-foreground">{BRAND_NAME}</h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Handcrafted sculptures and idols — Divine Series, car dashboard idols, and Pride of India statues, made
            by experienced artisans.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-cream-50"
              >
                <SocialIcon name={link.label} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All Sculptures</Link></li>
            <li><Link to="/new-launches" className="hover:text-foreground">New Launches</Link></li>
            <li><Link to="/custom-sculpture" className="hover:text-foreground">Custom Sculpture</Link></li>
            <li><Link to="/corporate-gifting" className="hover:text-foreground">Corporate Gifting</Link></li>
            <li><Link to="/track-order" className="hover:text-foreground">Track Your Order</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About / Our Story</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Policies</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {POLICY_LINKS.filter((l) => l.href.startsWith('/policies')).map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="container-page text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
