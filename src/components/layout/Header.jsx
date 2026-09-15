import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
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
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories } = useAsync(() => categoryApi.list(), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-50/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <button
          type="button"
          className="md:hidden cursor-pointer"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="font-display text-xl tracking-tight text-foreground md:text-2xl">
          {BRAND_NAME}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/shop" className="text-sm font-medium text-foreground hover:text-primary">
            Shop
          </Link>
          {(categories || []).slice(0, 5).map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary">
            Our Story
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden items-center lg:flex">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products…"
                className="h-10 w-56 rounded-full border border-border bg-cream-100 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          <Link to="/search" className="lg:hidden" aria-label="Search">
            <Search className="h-5 w-5 text-foreground" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Account menu" className="cursor-pointer">
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
