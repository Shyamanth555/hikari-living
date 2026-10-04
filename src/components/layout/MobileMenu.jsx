import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { POLICY_LINKS } from '../../lib/constants';

export function MobileMenu({ open, onOpenChange, categories = [] }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const close = () => onOpenChange(false);

  const handleLogout = () => {
    logout();
    close();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/40" />
        <DialogPrimitive.Content
          className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-cream-50 shadow-xl focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <DialogPrimitive.Title className="font-display text-lg">Menu</DialogPrimitive.Title>
            <DialogPrimitive.Close className="cursor-pointer" aria-label="Close menu">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-5 py-4 text-sm">
            <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop</p>
            <Link to="/shop" onClick={close} className="py-2.5 font-medium">
              All Idols
            </Link>
            <Link to="/new-launches" onClick={close} className="py-2.5 font-medium">
              New Launches
            </Link>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} onClick={close} className="py-2.5 font-medium">
                {cat.name}
              </Link>
            ))}

            <div className="my-3 border-t border-border" />

            <Link to="/custom-sculpture" onClick={close} className="py-2.5 font-medium">
              Custom Sculpture
            </Link>
            <Link to="/corporate-gifting" onClick={close} className="py-2.5 font-medium">
              Corporate Gifting
            </Link>
            <Link to="/blog" onClick={close} className="py-2.5 font-medium">
              Blog
            </Link>
            <Link to="/reviews" onClick={close} className="py-2.5 font-medium">
              Reviews
            </Link>

            <div className="my-3 border-t border-border" />

            <Link to="/about" onClick={close} className="py-2.5">
              Our Story
            </Link>
            <Link to="/track-order" onClick={close} className="py-2.5">
              Track Order
            </Link>
            <Link to="/contact" onClick={close} className="py-2.5">
              Contact Us
            </Link>

            <div className="my-3 border-t border-border" />

            {isAuthenticated ? (
              <>
                <p className="py-1 text-xs text-muted-foreground">Hi, {user?.name?.split(' ')[0]}</p>
                <Link to="/account" onClick={close} className="py-2.5">
                  My Account
                </Link>
                <Link to="/account/orders" onClick={close} className="py-2.5">
                  My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={close} className="py-2.5">
                    Admin Panel
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="py-2.5 text-left cursor-pointer">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close} className="py-2.5">
                  Log in
                </Link>
                <Link to="/register" onClick={close} className="py-2.5">
                  Create account
                </Link>
              </>
            )}

            <div className="my-3 border-t border-border" />

            {POLICY_LINKS.filter((link) => link.href.startsWith('/policies')).map((link) => (
              <Link key={link.href} to={link.href} onClick={close} className="py-2 text-xs text-muted-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
