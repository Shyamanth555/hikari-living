import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryForm } from '../../../components/admin/CategoryForm';
import { Spinner } from '../../../components/ui/Spinner';
import { useAsync } from '../../../hooks/useAsync';
import { categoryApi } from '../../../api/categoryApi';
import { useToast } from '../../../context/ToastContext';

export default function CategoryEdit() {
  const { id } = useParams();
  const { data: categories, loading } = useAsync(() => categoryApi.adminList(), []);
  const category = categories?.find((c) => c._id === id);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await categoryApi.adminUpdate(id, values);
      toast({ title: 'Category updated', variant: 'success' });
      navigate('/admin/categories');
    } catch (err) {
      toast({ title: 'Could not update category', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !category) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Category</h1>
      <CategoryForm defaultValues={category} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
    </div>
  );
}
