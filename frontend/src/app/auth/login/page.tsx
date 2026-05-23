'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Package, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/types';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { setAuth } = useAuthStore();
  const [showPw,    setShowPw]    = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirect = params.get('redirect') ?? '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const DEMO_USERS: Record<string, { password: string; user: User }> = {
    'admin@craftpacksolution.com': {
      password: 'Admin@Craftpack2024!',
      user: { id: 'usr-001', name: 'Craftpack Admin', email: 'admin@craftpacksolution.com', role: 'super_admin', isVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    },
    'manager@craftpacksolution.com': {
      password: 'Manager@2024!',
      user: { id: 'usr-002', name: 'Store Manager', email: 'manager@craftpacksolution.com', role: 'manager', isVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    },
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Demo / offline login
      const demo = DEMO_USERS[data.email.toLowerCase()];
      if (demo && demo.password === data.password) {
        setAuth(demo.user, { accessToken: 'demo-token', refreshToken: 'demo-refresh', expiresIn: 86400 });
        toast.success(`Welcome back, ${demo.user.name.split(' ')[0]}!`);
        const dest = ['admin', 'super_admin', 'manager'].includes(demo.user.role) ? '/admin' : redirect;
        router.push(dest);
        return;
      }

      // Real backend (fallback)
      const res = await authApi.login(data) as { data: { user: User; accessToken: string; refreshToken: string; expiresIn: number } };
      setAuth(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, expiresIn: res.data.expiresIn });
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      const dest = ['admin', 'super_admin', 'manager'].includes(res.data.user.role) ? '/admin' : redirect;
      router.push(dest);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-brand-900/20 to-transparent rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
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
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-dark-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="card p-8 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="p-3 rounded-xl bg-dark-800/60 border border-white/5 text-xs text-dark-400 space-y-1">
            <p className="font-medium text-dark-300">Demo credentials:</p>
            <p>Admin: <span className="text-dark-200">admin@craftpacksolution.com / Admin@Craftpack2024!</span></p>
          </div>

          <p className="text-center text-sm text-dark-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950" />}>
      <LoginForm />
    </Suspense>
  );
}
