import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogPostForm } from '../../../components/admin/BlogPostForm';
import { Spinner } from '../../../components/ui/Spinner';
import { useAsync } from '../../../hooks/useAsync';
import { blogApi } from '../../../api/blogApi';
import { useToast } from '../../../context/ToastContext';

export default function BlogPostEdit() {
  const { id } = useParams();
  const { data: post, loading } = useAsync(() => blogApi.adminGetById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await blogApi.adminUpdate(id, values);
      toast({ title: 'Post updated', variant: 'success' });
      navigate('/admin/blog');
    } catch (err) {
      toast({ title: 'Could not update post', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Blog Post</h1>
      <BlogPostForm defaultValues={post} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
    </div>
  );
}
