import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileSidebar } from './AdminMobileSidebar';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <p className="text-sm text-muted-foreground">Logged in as {user?.name}</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="text-sm font-medium text-foreground hover:underline cursor-pointer"
          >
            Log out
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>

      <AdminMobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </div>
  );
}
