import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { SEO } from '../../components/common/SEO';

const NAV_ITEMS = [
  { to: '/account', label: 'Profile', end: true },
  { to: '/account/orders', label: 'My Orders' },
];

export default function AccountLayout() {
  return (
    <div className="container-page py-10">
      <SEO title="My Account" />
      <h1 className="mb-8 font-display text-3xl text-foreground">My Account</h1>

      <div className="flex flex-col gap-10 md:flex-row">
        <nav className="flex shrink-0 gap-2 md:w-48 md:flex-col">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-ink-800 text-cream-50' : 'text-foreground hover:bg-cream-100'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
