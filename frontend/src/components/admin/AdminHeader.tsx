'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, RefreshCw, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getInitials } from '@/lib/utils';
import { formatRelativeDate } from '@/lib/utils';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'New Order Received',      message: 'Hyatt Regency placed an order for 5,000 bags',  type: 'success', isRead: false, createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: '2', title: 'Low Stock Alert',          message: 'Kraft paper running low (15% remaining)',       type: 'warning', isRead: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '3', title: 'Quote Request',            message: 'New bulk quote request from Safeway',           type: 'info',    isRead: true,  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '4', title: 'Order Delivered',          message: 'Order CP-1234 delivered to Kaldi\'s Coffee',   type: 'success', isRead: true,  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

function getPageTitle(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 1) return 'Dashboard';
  return parts[parts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminHeader() {
  const { user } = useAuthStore();
  const pathname  = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark,             setIsDark]            = useState(true);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">

        {/* Left: Page Title */}
        <div className="ml-10 lg:ml-0">
          <h1 className="font-display font-bold text-lg text-white">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-xs text-dark-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-dark-800/60 border border-white/5 rounded-xl px-3 py-2 text-sm text-dark-400 min-w-52">
            <Search className="w-4 h-4 flex-shrink-0" />
            <span>Search...</span>
            <kbd className="ml-auto text-2xs bg-dark-700 px-1.5 py-0.5 rounded border border-white/10 text-dark-500">⌘K</kbd>
          </div>

          {/* Refresh */}
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-dark-900" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-80 bg-dark-900 border border-white/5 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">Notifications</p>
                      {unreadCount > 0 && <p className="text-xs text-dark-400">{unreadCount} unread</p>}
                    </div>
                    <button className="text-xs text-brand-400 hover:text-brand-300">Mark all read</button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map(n => (
                      <div
                        key={n.id}
                        className={`flex gap-3 p-4 border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer ${!n.isRead ? 'bg-brand-900/10' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-brand-400' : 'bg-dark-600'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">{n.title}</p>
                          <p className="text-xs text-dark-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-dark-600 mt-1">{formatRelativeDate(n.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-white/5">
                    <button className="w-full text-xs text-brand-400 hover:text-brand-300 text-center py-1.5">
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-2xs text-dark-500 mt-0.5 capitalize">{user.role.replace(/_/g, ' ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
