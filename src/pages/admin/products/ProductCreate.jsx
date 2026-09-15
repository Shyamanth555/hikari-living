import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../../../components/admin/ProductForm';
import { useAsync } from '../../../hooks/useAsync';
import { categoryApi } from '../../../api/categoryApi';
import { productApi } from '../../../api/productApi';
import { useToast } from '../../../context/ToastContext';

export default function ProductCreate() {
  const { data: categories } = useAsync(() => categoryApi.adminList(), []);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await productApi.adminCreate(values);
      toast({ title: 'Product created', variant: 'success' });
      navigate('/admin/products');
    } catch (err) {
      toast({ title: 'Could not create product', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Add Product</h1>
      <ProductForm categories={categories || []} onSubmit={handleSubmit} submitting={submitting} submitLabel="Create product" />
    </div>
  );
}
