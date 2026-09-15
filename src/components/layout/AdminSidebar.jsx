import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Mail, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/cn';
import { BRAND_NAME } from '../../lib/constants';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-cream-100 md:block">
      <div className="px-5 py-6">
        <p className="font-display text-lg">{BRAND_NAME}</p>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-ink-800 text-cream-50' : 'text-foreground hover:bg-cream-200'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <a
        href="/"
        className="mt-6 flex items-center gap-2 px-6 py-2.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View storefront
      </a>
    </aside>
  );
}
