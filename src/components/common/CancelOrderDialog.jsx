import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';

export function CancelOrderDialog({ open, onOpenChange, onConfirm, cancelling = false, children }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !cancelling && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this order?</DialogTitle>
          <DialogDescription>{children}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={cancelling}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={cancelling}>
            {cancelling ? 'Cancelling…' : 'Cancel Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
