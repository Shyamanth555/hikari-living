import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { AddressForm } from '../../components/common/AddressForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../api/userApi';

function InfoTab() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await userApi.updateProfile(form);
      updateUser(updated);
      toast({ title: 'Profile updated', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not update profile', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={form.phone}
          onChange={(e) =>
            setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
          }
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}

function AddressesTab() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openAddDialog = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const openEditDialog = (addr) => {
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const updated = editingAddress
        ? await userApi.updateAddress(editingAddress._id, data)
        : await userApi.addAddress(data);
      updateUser(updated);
      setDialogOpen(false);
      toast({ title: editingAddress ? 'Address updated' : 'Address added', variant: 'success' });
    } catch (err) {
      toast({
        title: editingAddress ? 'Could not update address' : 'Could not add address',
        description: err?.response?.data?.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const updated = await userApi.deleteAddress(addressId);
      updateUser(updated);
      toast({ title: 'Address removed', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not remove address', description: err?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-3">
        {(user.addresses || []).map((addr) => (
          <div key={addr._id} className="flex items-start justify-between rounded-md border border-border p-4 text-sm">
            <div>
              <p className="font-medium text-foreground">
                {addr.fullName} {addr.isDefault && <span className="text-xs text-primary">(Default)</span>}
              </p>
              <p className="text-muted-foreground">
                {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-muted-foreground">{addr.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openEditDialog(addr)}
                className="text-muted-foreground hover:text-primary cursor-pointer"
                aria-label="Edit address"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(addr._id)}
                className="text-muted-foreground hover:text-destructive cursor-pointer"
                aria-label="Delete address"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="mt-4" onClick={openAddDialog}>
        <Plus className="h-4 w-4" /> Add address
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit address' : 'Add address'}</DialogTitle>
          </DialogHeader>
          <AddressForm
            defaultValues={editingAddress || undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel={editingAddress ? 'Save changes' : 'Add address'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PasswordTab() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await userApi.changePassword(form);
      toast({ title: 'Password updated', description: 'Please log in again.', variant: 'success' });
      await logout();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  );
}

export default function Profile() {
  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <InfoTab />
      </TabsContent>
      <TabsContent value="addresses">
        <AddressesTab />
      </TabsContent>
      <TabsContent value="password">
        <PasswordTab />
      </TabsContent>
    </Tabs>
  );
}
