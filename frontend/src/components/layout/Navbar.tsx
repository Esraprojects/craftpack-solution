'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ShoppingCart, User, ChevronDown,
  Package, Star, Globe, Leaf, Phone, FileText,
  BarChart2, Settings, LogOut, Bell, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { getInitials } from '@/lib/utils';

const navItems = [
  { label: 'Products', href: '/products', icon: Package,
    children: [
      { label: 'Paper Bags',        href: '/products?category=paper_bags',   desc: 'Premium kraft & art paper bags' },
      { label: 'Shopping Bags',     href: '/products?category=shopping_bags', desc: 'Retail & fashion shopping bags' },
      { label: 'Luxury Packaging',  href: '/products?category=luxury_bags',  desc: 'High-end gift & luxury bags' },
      { label: 'Food Packaging',    href: '/products?category=food_packaging', desc: 'Hygienic food-safe packaging' },
      { label: 'Eco-Friendly',      href: '/products?category=eco_friendly', desc: 'Sustainable green packaging' },
      { label: 'Custom Printed',    href: '/products?category=custom_printed', desc: 'Fully branded custom orders' },
    ],
  },
  { label: 'Industries', href: '/industries', icon: Globe },
  { label: 'Portfolio',  href: '/portfolio',  icon: Star },
  { label: 'Sustainability', href: '/sustainability', icon: Leaf },
  { label: 'Blog',       href: '/blog',       icon: FileText },
  { label: 'About',      href: '/about',      icon: Globe },
];

export default function Navbar() {
  const pathname    = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { itemCount, toggleCart }            = useCartStore();
  const cartCount   = itemCount();

  const [isScrolled,     setIsScrolled]     = useState(false);
  const [isMobileOpen,   setIsMobileOpen]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-dark-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-brand">
                  <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">Craftpack</div>
                <div className="text-brand-400 text-xs font-medium tracking-widest uppercase leading-none mt-0.5">Solution</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map(item => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <button
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive(item.href)
                          ? 'text-white bg-white/10'
                          : 'text-dark-300 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === item.label && 'rotate-180')} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive(item.href)
                          ? 'text-white bg-white/10'
                          : 'text-dark-300 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute top-full left-0 mt-1 w-72 glass-dark rounded-2xl p-2 shadow-2xl"
                        >
                          {item.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors duration-150 group"
                            >
                              <span className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{child.label}</span>
                              <span className="text-xs text-dark-400">{child.desc}</span>
                            </Link>
                          ))}
                          <div className="mt-2 pt-2 border-t border-white/5 px-2">
                            <Link href="/products" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 text-sm font-medium transition-colors">
                              View All Products →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/quote" className="btn-gold text-xs px-4 py-2.5">
                Get Quote
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm text-dark-200">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-dark-400" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-56 glass-dark rounded-2xl p-2 shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-white/5 mb-1">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-dark-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-dark-200 hover:text-white transition-colors">
                          <BarChart2 className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-dark-200 hover:text-white transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-dark-200 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-brand-300 hover:text-brand-200 transition-colors">
                            <BarChart2 className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={() => { clearAuth(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-dark-300 hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="btn-secondary text-xs px-4 py-2.5">Sign In</Link>
                  <Link href="/auth/register" className="btn-primary text-xs px-4 py-2.5">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={toggleCart} className="relative p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 overflow-hidden lg:hidden"
          >
            <div className="px-4 py-6 space-y-1 max-h-[calc(100vh-72px)] overflow-y-auto">
              {navItems.map(item => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-white/5">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-lg text-sm text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <Link href="/quote" className="btn-gold w-full justify-center">Get a Quote</Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="btn-secondary w-full justify-center">Dashboard</Link>
                    <button onClick={clearAuth} className="btn-secondary w-full justify-center text-red-400">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login"    className="btn-secondary w-full justify-center">Sign In</Link>
                    <Link href="/auth/register" className="btn-primary  w-full justify-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
