'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Archive, FileText, Settings, ChevronDown, ChevronRight,
  MessageSquare, Bell, Activity, Database, Tag, Menu, X,
  LogOut, Globe, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { getInitials } from '@/lib/utils';

const navItems = [
  {
    title:    'Overview',
    href:     '/admin',
    icon:     LayoutDashboard,
    exact:    true,
  },
  {
    title:    'Orders',
    href:     '/admin/orders',
    icon:     ShoppingCart,
    badge:    '12',
    badgeVariant: 'warning' as const,
  },
  {
    title:    'Products',
    href:     '/admin/products',
    icon:     Package,
    children: [
      { title: 'All Products',  href: '/admin/products' },
      { title: 'Add Product',   href: '/admin/products/new' },
      { title: 'Categories',    href: '/admin/products/categories' },
      { title: 'Reviews',       href: '/admin/products/reviews' },
    ],
  },
  {
    title:    'Customers',
    href:     '/admin/customers',
    icon:     Users,
  },
  {
    title:    'Analytics',
    href:     '/admin/analytics',
    icon:     BarChart2,
    children: [
      { title: 'Revenue',    href: '/admin/analytics/revenue' },
      { title: 'Orders',     href: '/admin/analytics/orders' },
      { title: 'Customers',  href: '/admin/analytics/customers' },
      { title: 'Products',   href: '/admin/analytics/products' },
    ],
  },
  {
    title:    'Inventory',
    href:     '/admin/inventory',
    icon:     Archive,
  },
  {
    title:    'Quote Requests',
    href:     '/admin/quotes',
    icon:     Tag,
  },
  {
    title:    'Blog',
    href:     '/admin/blog',
    icon:     FileText,
  },
  {
    title:    'Inquiries',
    href:     '/admin/inquiries',
    icon:     MessageSquare,
  },
  {
    title:    'Activity Logs',
    href:     '/admin/activity',
    icon:     Activity,
  },
  {
    title:    'Settings',
    href:     '/admin/settings',
    icon:     Settings,
  },
  {
    title:    'Access Control',
    href:     '/admin/access',
    icon:     Shield,
  },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const { user, clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-brand">
          <Package className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display font-bold text-white text-sm leading-none">Craftpack</div>
            <div className="text-brand-400 text-xs mt-0.5">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <div key={item.href}>
            {item.children ? (
              <>
                <button
                  onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive(item.href)
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {expanded === item.href
                        ? <ChevronDown className="w-3.5 h-3.5" />
                        : <ChevronRight className="w-3.5 h-3.5" />
                      }
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {!collapsed && expanded === item.href && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-4 pl-4 border-l border-white/5 mt-0.5 space-y-0.5"
                    >
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
                            pathname === child.href
                              ? 'text-brand-300 bg-brand-600/10'
                              : 'text-dark-400 hover:text-white hover:bg-white/5'
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive(item.href, item.exact)
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        'text-2xs px-1.5 py-0.5 rounded-full font-bold',
                        item.badgeVariant === 'warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-brand-500/20 text-brand-300'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-dark-400 hover:text-white hover:bg-white/5 transition-colors mb-1">
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'View Website'}
        </Link>
        {user && (
          <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-800/60', collapsed && 'justify-center')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-2xs text-dark-500 truncate capitalize">{user.role.replace(/_/g, ' ')}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={clearAuth} className="p-1 text-dark-500 hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col bg-dark-900 border-r border-white/5 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-dark-400 hover:text-white transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 -rotate-90" />}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-dark-800 border border-white/10 text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-dark-900 border-r border-white/5 lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
