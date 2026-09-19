import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/common/SEO';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await registerUser(values);
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/account');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <SEO title="Create Account" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-foreground">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join to track orders and check out faster.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Full name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                },
              })}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={submitting} size="lg" className="w-full">
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
