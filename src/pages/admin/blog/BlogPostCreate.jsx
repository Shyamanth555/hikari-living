import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPostForm } from '../../../components/admin/BlogPostForm';
import { blogApi } from '../../../api/blogApi';
import { useToast } from '../../../context/ToastContext';

export default function BlogPostCreate() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await blogApi.adminCreate(values);
      toast({ title: 'Post created', variant: 'success' });
      navigate('/admin/blog');
    } catch (err) {
      toast({ title: 'Could not create post', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl text-foreground">New Blog Post</h1>
      <BlogPostForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create post" />
    </div>
  );
}
