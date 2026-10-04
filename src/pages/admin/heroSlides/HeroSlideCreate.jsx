import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlideForm } from '../../../components/admin/HeroSlideForm';
import { useAsync } from '../../../hooks/useAsync';
import { productApi } from '../../../api/productApi';
import { heroSlideApi } from '../../../api/heroSlideApi';
import { useToast } from '../../../context/ToastContext';

export default function HeroSlideCreate() {
  const { data: products } = useAsync(() => productApi.adminList({ limit: 100 }), []);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await heroSlideApi.adminCreate(values);
      toast({ title: 'Slide created', variant: 'success' });
      navigate('/admin/hero-slides');
    } catch (err) {
      toast({ title: 'Could not create slide', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Add Hero Slide</h1>
      <HeroSlideForm products={products?.data || []} onSubmit={handleSubmit} submitting={submitting} submitLabel="Create slide" />
    </div>
  );
}
