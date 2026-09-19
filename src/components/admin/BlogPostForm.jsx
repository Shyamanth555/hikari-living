import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ImageUploader } from './ImageUploader';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  status: z.enum(['draft', 'published']),
  tags: z.string().optional(),
});

export function BlogPostForm({ defaultValues, onSubmit, submitting = false, submitLabel = 'Save post' }) {
  const [coverImage, setCoverImage] = useState(defaultValues?.coverImage?.url ? [defaultValues.coverImage] : []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      author: 'Hikari Living',
      status: 'draft',
      ...defaultValues,
      tags: (defaultValues?.tags || []).join(', '),
    },
  });

  const contentValue = watch('content');

  const submit = (values) => {
    onSubmit({
      ...values,
      coverImage: coverImage[0] || { url: '', publicId: '' },
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label>Cover image</Label>
        <ImageUploader images={coverImage} onChange={setCoverImage} max={1} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} placeholder="A one or two line summary shown on the blog listing" {...register('excerpt')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">
          Content (Markdown) <span className="text-destructive">*</span>
        </Label>
        <Tabs defaultValue="write">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write">
            <Textarea id="content" rows={16} className="font-mono text-sm" {...register('content')} />
          </TabsContent>
          <TabsContent value="preview">
            <div className="markdown-content rounded-md border border-border p-4">
              {contentValue ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentValue}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">Nothing to preview yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register('author')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" placeholder="e.g. guide, brass, care" {...register('tags')} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
