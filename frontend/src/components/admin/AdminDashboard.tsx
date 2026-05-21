'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingCart, Users,
  Package, DollarSign, AlertTriangle, Clock,
  ArrowRight, BarChart2, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Link from 'next/link';
import { analyticsApi } from '@/lib/api';
import { formatCurrency, formatNumber, getStatusColor, getStatusLabel, formatRelativeDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const MOCK_STATS = {
  totalRevenue:    2847500,
  revenueChange:   +18.4,
  totalOrders:     1247,
  ordersChange:    +12.3,
  totalCustomers:  528,
  customersChange: +8.7,
  activeProducts:  48,
  pendingOrders:   23,
  lowStockItems:   5,
  conversionRate:  64.2,
};

const MOCK_REVENUE = [
  { date: '2024-01', revenue: 185000, orders: 89 },
  { date: '2024-02', revenue: 210000, orders: 102 },
  { date: '2024-03', revenue: 195000, orders: 94 },
  { date: '2024-04', revenue: 248000, orders: 118 },
  { date: '2024-05', revenue: 267000, orders: 129 },
  { date: '2024-06', revenue: 298000, orders: 143 },
  { date: '2024-07', revenue: 312000, orders: 152 },
  { date: '2024-08', revenue: 289000, orders: 138 },
  { date: '2024-09', revenue: 334000, orders: 162 },
  { date: '2024-10', revenue: 356000, orders: 174 },
  { date: '2024-11', revenue: 378000, orders: 183 },
  { date: '2024-12', revenue: 395000, orders: 191 },
];

const MOCK_SEGMENT = [
  { name: 'Corporate Bulk', value: 42, color: '#0ea5e9' },
  { name: 'Retail',         value: 31, color: '#f59e0b' },
  { name: 'Hospitality',    value: 18, color: '#10b981' },
  { name: 'Other',          value: 9,  color: '#6366f1' },
];

const MOCK_TOP_PRODUCTS = [
  { name: 'Premium Kraft Bag',      revenue: 485000, units: 38800, growth: +24 },
  { name: 'Eco Recycled Bag',       revenue: 342000, units: 39086, growth: +18 },
  { name: 'Luxury Laminated Bag',   revenue: 298000, units: 10643, growth: +31 },
  { name: 'Food-Grade Bag',         revenue: 187000, units: 28769, growth: +9  },
  { name: 'Corporate Gift Bag',     revenue: 163000, units:  4657, growth: +42 },
];

const MOCK_RECENT_ORDERS = [
  { id: '1', orderNumber: 'CP-1A2B3C', customer: 'Hyatt Regency', total: 45000, status: 'in_production', createdAt: new Date(Date.now() - 2*60*60*1000).toISOString() },
  { id: '2', orderNumber: 'CP-4D5E6F', customer: 'Kaldi\'s Coffee', total: 12800, status: 'confirmed', createdAt: new Date(Date.now() - 5*60*60*1000).toISOString() },
  { id: '3', orderNumber: 'CP-7G8H9I', customer: 'Safeway', total: 87500, status: 'pending', createdAt: new Date(Date.now() - 8*60*60*1000).toISOString() },
  { id: '4', orderNumber: 'CP-JKLMNO', customer: 'Friendship Super', total: 23400, status: 'shipped', createdAt: new Date(Date.now() - 24*60*60*1000).toISOString() },
  { id: '5', orderNumber: 'CP-PQRSTU', customer: 'Ethiopian Airlines', total: 156000, status: 'delivered', createdAt: new Date(Date.now() - 48*60*60*1000).toISOString() },
];

const statCards = [
  {
    title:     'Total Revenue',
    value:     formatCurrency(MOCK_STATS.totalRevenue),
    change:    MOCK_STATS.revenueChange,
    icon:      DollarSign,
    gradient:  'from-brand-500 to-brand-700',
    bg:        'bg-brand-500/10',
    iconColor: 'text-brand-400',
  },
  {
    title:     'Total Orders',
    value:     formatNumber(MOCK_STATS.totalOrders),
    change:    MOCK_STATS.ordersChange,
    icon:      ShoppingCart,
    gradient:  'from-gold-500 to-amber-700',
    bg:        'bg-gold-500/10',
    iconColor: 'text-gold-400',
  },
  {
    title:     'Total Customers',
    value:     formatNumber(MOCK_STATS.totalCustomers),
    change:    MOCK_STATS.customersChange,
    icon:      Users,
    gradient:  'from-emerald-500 to-green-700',
    bg:        'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    title:     'Active Products',
    value:     MOCK_STATS.activeProducts.toString(),
    change:    0,
    icon:      Package,
    gradient:  'from-purple-500 to-violet-700',
    bg:        'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-dark-400 mb-2">{label}</p>
        {payload.map(entry => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-dark-300">{entry.name}:</span>
            <span className="font-bold text-white">
              {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">

      {/* Alert Banner */}
      {MOCK_STATS.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300 flex-1">
            You have <strong>{MOCK_STATS.pendingOrders} pending orders</strong> awaiting confirmation.
          </p>
          <Link href="/admin/orders?status=pending" className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
            Review <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
              </div>
              {stat.change !== 0 && (
                <span className={cn(
                  'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                  stat.change > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                )}>
                  {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
              <p className="text-xs text-dark-400 mt-0.5">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue Chart — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs text-dark-400">Monthly revenue & order trends</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d', '1y'].map(p => (
                <button
                  key={p}
                  className="text-xs px-2.5 py-1 rounded-lg bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MOCK_REVENUE} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => formatNumber(v)} yAxisId="revenue" orientation="left" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} yAxisId="orders" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#revenueGrad)" yAxisId="revenue" />
              <Area type="monotone" dataKey="orders"  stroke="#f59e0b" strokeWidth={2} fill="url(#ordersGrad)"  yAxisId="orders" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Segments Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-white">Customer Segments</h3>
            <p className="text-xs text-dark-400">By order type</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={MOCK_SEGMENT}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {MOCK_SEGMENT.map(entry => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MOCK_SEGMENT.map(seg => (
              <div key={seg.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                  <span className="text-xs text-dark-300">{seg.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{seg.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Top Products</h3>
            <Link href="/admin/analytics/products" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-dark-700 flex items-center justify-center text-xs text-dark-400 font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div
                      className="h-1 rounded-full bg-brand-500"
                      style={{ width: `${(p.revenue / MOCK_TOP_PRODUCTS[0].revenue) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-white">{formatCurrency(p.revenue)}</p>
                  <p className={cn('text-2xs', p.growth > 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {p.growth > 0 ? '+' : ''}{p.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-header text-left pb-3">Order</th>
                  <th className="table-header text-left pb-3">Customer</th>
                  <th className="table-header text-right pb-3">Amount</th>
                  <th className="table-header text-center pb-3">Status</th>
                  <th className="table-header text-right pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {MOCK_RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                    <td className="table-cell">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-brand-400 hover:text-brand-300">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="table-cell">{order.customer}</td>
                    <td className="table-cell text-right font-medium">{formatCurrency(order.total)}</td>
                    <td className="table-cell text-center">
                      <span className={cn('badge text-xs', getStatusColor(order.status))}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="table-cell text-right text-dark-500 text-xs">
                      {formatRelativeDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-2xl text-white">{MOCK_STATS.pendingOrders}</span>
          </div>
          <p className="text-xs text-dark-400">Pending Orders</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-bold text-2xl text-white">{MOCK_STATS.lowStockItems}</span>
          </div>
          <p className="text-xs text-dark-400">Low Stock Items</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-2xl text-white">{MOCK_STATS.conversionRate}%</span>
          </div>
          <p className="text-xs text-dark-400">Conversion Rate</p>
        </div>
      </motion.div>
    </div>
  );
}
