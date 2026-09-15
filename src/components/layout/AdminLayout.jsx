import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-5">
          <p className="text-sm text-muted-foreground">Logged in as {user?.name}</p>
          <button
            type="button"
            onClick={() => logout()}
            className="text-sm font-medium text-foreground hover:underline cursor-pointer"
          >
            Log out
          </button>
        </header>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
