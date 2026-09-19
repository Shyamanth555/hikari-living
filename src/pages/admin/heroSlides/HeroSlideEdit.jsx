import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeroSlideForm } from '../../../components/admin/HeroSlideForm';
import { Spinner } from '../../../components/ui/Spinner';
import { useAsync } from '../../../hooks/useAsync';
import { productApi } from '../../../api/productApi';
import { heroSlideApi } from '../../../api/heroSlideApi';
import { useToast } from '../../../context/ToastContext';

export default function HeroSlideEdit() {
  const { id } = useParams();
  const { data: products } = useAsync(() => productApi.adminList({ limit: 100 }), []);
  const { data: slide, loading } = useAsync(() => heroSlideApi.adminGetById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await heroSlideApi.adminUpdate(id, values);
      toast({ title: 'Slide updated', variant: 'success' });
      navigate('/admin/hero-slides');
    } catch (err) {
      toast({ title: 'Could not update slide', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !slide) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Hero Slide</h1>
      <HeroSlideForm
        defaultValues={slide}
        products={products?.data || []}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
