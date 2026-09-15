import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../../../components/admin/ProductForm';
import { Spinner } from '../../../components/ui/Spinner';
import { useAsync } from '../../../hooks/useAsync';
import { categoryApi } from '../../../api/categoryApi';
import { productApi } from '../../../api/productApi';
import { useToast } from '../../../context/ToastContext';

export default function ProductEdit() {
  const { id } = useParams();
  const { data: categories } = useAsync(() => categoryApi.adminList(), []);
  const { data: product, loading } = useAsync(() => productApi.adminGetById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await productApi.adminUpdate(id, values);
      toast({ title: 'Product updated', variant: 'success' });
      navigate('/admin/products');
    } catch (err) {
      toast({ title: 'Could not update product', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Product</h1>
      <ProductForm
        defaultValues={product}
        categories={categories || []}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
