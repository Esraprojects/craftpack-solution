'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { ShoppingBag, FileText, Settings, LogOut, Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function DashboardPage() {
  const { user, clearAuth } = useAuthStore();

  const quickLinks = [
    { href: '/products', icon: Package, label: 'Browse Products', desc: 'Explore our full catalogue' },
    { href: '/quote', icon: FileText, label: 'Request a Quote', desc: 'Get custom pricing' },
    { href: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders', desc: 'Track your orders' },
    { href: '/dashboard/settings', icon: Settings, label: 'Account Settings', desc: 'Manage your profile' },
  ];

  const statusItems = [
    { icon: Clock, label: 'Pending Review', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: CheckCircle, label: 'Confirmed', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    { icon: Truck, label: 'Shipped', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-1">Customer Portal</p>
          <h1 className="text-3xl font-bold text-white font-display">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Customer'}
          </h1>
          <p className="text-dark-400 mt-1">{user?.company ? `${user.company} · ` : ''}{user?.email}</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card p-5 card-hover flex flex-col gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">{item.label}</p>
                <p className="text-dark-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Order Status Guide */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-bold text-white text-lg mb-4">Order Status Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statusItems.map((s) => (
              <div key={s.label} className={`flex items-center gap-3 p-3 rounded-xl border ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-sm font-medium text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn-primary">Browse Products</Link>
          <Link href="/quote" className="btn-secondary">Request Quote</Link>
          <button
            onClick={clearAuth}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-dark-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
