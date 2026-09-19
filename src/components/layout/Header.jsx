import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAsync } from '../../hooks/useAsync';
import { categoryApi } from '../../api/categoryApi';
import { BRAND_NAME } from '../../lib/constants';
import { CartDrawer } from '../cart/CartDrawer';
import { MobileMenu } from './MobileMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/DropdownMenu';

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: categories } = useAsync(() => categoryApi.list(), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-50/95 backdrop-blur">
      <div className="container-page relative flex h-16 items-center justify-between gap-4 md:h-20">
        <button
          type="button"
          className="md:hidden cursor-pointer"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link
          to="/"
          aria-label={BRAND_NAME}
          className="absolute left-1/2 top-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
        >
          <img src="/logo.png" alt={BRAND_NAME} className="h-12 w-12 object-contain md:h-14 md:w-14" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 text-sm font-medium text-foreground hover:text-primary">
              Shop <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/shop">All Sculptures</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/new-launches">New Launches</Link>
              </DropdownMenuItem>
              {(categories || []).length > 0 && <DropdownMenuSeparator />}
              {(categories || []).map((cat) => (
                <DropdownMenuItem key={cat._id} asChild>
                  <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/custom-sculpture" className="text-sm font-medium text-foreground hover:text-primary">
            Custom Sculpture
          </Link>
          <Link to="/corporate-gifting" className="text-sm font-medium text-foreground hover:text-primary">
            Corporate Gifting
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary">
            Blog
          </Link>
          <Link to="/reviews" className="text-sm font-medium text-foreground hover:text-primary">
            Reviews
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="Search">
            <Search className="h-5 w-5 text-foreground" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Account menu" className="hidden cursor-pointer md:block">
              <User className="h-5 w-5 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <div className="px-2.5 py-1.5 text-xs text-muted-foreground">Hi, {user.name.split(' ')[0]}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()}>Log out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} categories={categories || []} />
    </header>
  );
}
