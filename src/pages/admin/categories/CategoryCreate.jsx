import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryForm } from '../../../components/admin/CategoryForm';
import { categoryApi } from '../../../api/categoryApi';
import { useToast } from '../../../context/ToastContext';

export default function CategoryCreate() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await categoryApi.adminCreate(values);
      toast({ title: 'Category created', variant: 'success' });
      navigate('/admin/categories');
    } catch (err) {
      toast({ title: 'Could not create category', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Add Category</h1>
      <CategoryForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create category" />
    </div>
  );
}
