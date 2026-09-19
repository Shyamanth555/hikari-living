import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { AdminSidebarContent } from './AdminSidebar';

export function AdminMobileSidebar({ open, onOpenChange }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/40 md:hidden" />
        <DialogPrimitive.Content
          className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-cream-100 shadow-xl focus:outline-none md:hidden"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <DialogPrimitive.Title className="font-display text-lg">Menu</DialogPrimitive.Title>
            <DialogPrimitive.Close className="cursor-pointer" aria-label="Close menu">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <AdminSidebarContent onNavigate={() => onOpenChange(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
