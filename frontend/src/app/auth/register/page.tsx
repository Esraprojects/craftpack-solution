'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Package, ArrowRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { User, AuthTokens } from '@/types';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters').regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  phone:    z.string().optional(),
  company:  z.string().optional(),
  agreeTerms: z.boolean().refine(v => v, 'You must agree to the terms'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router      = useRouter();
  const { setAuth } = useAuthStore();
  const [showPw,    setShowPw]    = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { agreeTerms: _, ...submitData } = data;
      const res = await authApi.register(submitData) as { data: { user: User; accessToken: string; refreshToken: string; expiresIn: number } };
      setAuth(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, expiresIn: res.data.expiresIn });
      toast.success('Account created! Welcome to Craftpack Solution.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-brand-900/20 to-transparent rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-brand">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white text-lg leading-none">Craftpack</div>
              <div className="text-brand-400 text-xs font-medium tracking-widest uppercase leading-none mt-0.5">Solution</div>
            </div>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-dark-400 text-sm mt-1">Join 500+ businesses using Craftpack</p>
        </div>

        <div className="card p-8 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name *</label>
                <input {...register('name')} placeholder="Yohannes Tadesse" className="input-field" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input {...register('email')} type="email" placeholder="you@company.com" className="input-field" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input {...register('phone')} placeholder="+251 911 000 000" className="input-field" />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Company / Business Name</label>
                <input {...register('company')} placeholder="Your Company Ltd." className="input-field" />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Password *</label>
                <div className="relative">
                  <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input {...register('agreeTerms')} type="checkbox" className="mt-0.5 accent-brand-500 w-4 h-4 flex-shrink-0" />
              <span className="text-xs text-dark-400 group-hover:text-dark-300 transition-colors">
                I agree to the <Link href="/terms" className="text-brand-400 hover:text-brand-300">Terms of Service</Link> and <Link href="/privacy" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-red-400">{errors.agreeTerms.message}</p>}

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
