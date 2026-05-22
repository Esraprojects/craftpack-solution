'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Eye, RefreshCw, ChevronDown, X,
  CheckCircle, Clock, Truck, Package, XCircle, AlertCircle,
} from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem { product: string; qty: number; unitPrice: number; }
interface Order {
  id:         string;
  customer:   string;
  email:      string;
  phone:      string;
  items:      OrderItem[];
  total:      number;
  status:     OrderStatus;
  createdAt:  string;
  notes:      string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; badge: string; icon: React.ElementType; next?: OrderStatus }> = {
  pending:    { label: 'Pending',    badge: 'badge-warning', icon: Clock,        next: 'confirmed' },
  confirmed:  { label: 'Confirmed',  badge: 'badge-brand',   icon: CheckCircle,  next: 'production' },
  production: { label: 'Production', badge: 'badge-gold',    icon: Package,      next: 'shipped' },
  shipped:    { label: 'Shipped',    badge: 'badge-neutral',  icon: Truck,        next: 'delivered' },
  delivered:  { label: 'Delivered',  badge: 'badge-success', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  badge: 'badge-danger',  icon: XCircle },
};

const SEED: Order[] = [
  { id:'ORD-0041', customer:'Kaldi\'s Coffee',   email:'orders@kaldis.et',       phone:'0911001001', items:[{product:'Custom Printed Tote',qty:2000,unitPrice:18}],              total:36000, status:'production', createdAt:'2026-05-18', notes:'Logo in 2-colour PMS. Rush order.' },
  { id:'ORD-0040', customer:'Hyatt Regency',      email:'procurement@hyatt.com',   phone:'0115505050', items:[{product:'Luxury Ribbon Bag',qty:500,unitPrice:35}],               total:17500, status:'shipped',    createdAt:'2026-05-15', notes:'Satin ribbon in gold.' },
  { id:'ORD-0039', customer:'Safeway Supermarket',email:'supply@safeway.et',        phone:'0919003003', items:[{product:'Kraft Paper Bag – Large',qty:5000,unitPrice:14}],        total:70000, status:'confirmed',  createdAt:'2026-05-14', notes:'' },
  { id:'ORD-0038', customer:'Ethiopian Airlines', email:'catering@ethiopianair.et', phone:'0111781780', items:[{product:'Food Kraft Bag',qty:10000,unitPrice:6}],                 total:60000, status:'delivered',  createdAt:'2026-05-10', notes:'Greaseproof liner required.' },
  { id:'ORD-0037', customer:'Getu Commercial',    email:'getu@gecommer.et',         phone:'0921004004', items:[{product:'Shopping Bag – Medium',qty:3000,unitPrice:11}],          total:33000, status:'pending',    createdAt:'2026-05-20', notes:'Standard kraft, no print.' },
  { id:'ORD-0036', customer:'Bole Patisserie',    email:'orders@bolepatisserie.et', phone:'0910005005', items:[{product:'Cake & Pastry Box',qty:200,unitPrice:20}],               total:4000,  status:'pending',    createdAt:'2026-05-21', notes:'White board with PVC window.' },
  { id:'ORD-0035', customer:'Dashen Bank',        email:'marketing@dashenbank.com', phone:'0115600056', items:[{product:'Eco Jute-Style Bag',qty:1000,unitPrice:22}],             total:22000, status:'delivered',  createdAt:'2026-05-01', notes:'Corporate gift bags.' },
  { id:'ORD-0034', customer:'Alem Clothing',      email:'hello@alemclothing.et',    phone:'0933006006', items:[{product:'Luxury Ribbon Bag',qty:300,unitPrice:35},{product:'Shopping Bag – Medium',qty:700,unitPrice:11}], total:18200, status:'cancelled', createdAt:'2026-04-28', notes:'Cancelled by client.' },
];

function OrderDetail({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity:0, scale:0.95, y:10 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto card bg-dark-900 border-white/10 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">{order.id}</h3>
            <p className="text-sm text-dark-400">{order.customer}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        {/* Status & progress */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
          <cfg.icon className="w-5 h-5 text-brand-400" />
          <div className="flex-1">
            <span className={cfg.badge}>{cfg.label}</span>
            <p className="text-xs text-dark-500 mt-1">Order date: {order.createdAt}</p>
          </div>
          {cfg.next && (
            <button
              onClick={() => onStatusChange(order.id, cfg.next!)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Advance to {STATUS_CONFIG[cfg.next].label}
            </button>
          )}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className="btn-ghost text-xs px-3 py-1.5 hover:text-red-400"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-dark-500">Email </span><span className="text-dark-200">{order.email}</span></div>
          <div><span className="text-dark-500">Phone </span><span className="text-dark-200">{order.phone}</span></div>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Order Items</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/3">
                <div>
                  <p className="text-sm font-medium text-white">{item.product}</p>
                  <p className="text-xs text-dark-500">{item.qty.toLocaleString()} units × ETB {item.unitPrice}</p>
                </div>
                <p className="font-medium text-white">ETB {(item.qty * item.unitPrice).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/5">
            <span className="font-semibold text-white">Total</span>
            <span className="font-bold text-brand-400 text-lg">ETB {order.total.toLocaleString()}</span>
          </div>
        </div>

        {order.notes && (
          <div className="p-3 rounded-xl bg-gold-500/5 border border-gold-500/15 text-sm text-gold-300">
            <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />{order.notes}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminOrdersSection() {
  const [orders,     setOrders]     = useState<Order[]>(SEED);
  const [search,     setSearch]     = useState('');
  const [filterSt,   setFilterSt]   = useState<'all' | OrderStatus>('all');
  const [selected,   setSelected]   = useState<Order | null>(null);

  const filtered = useMemo(() =>
    orders
      .filter(o => filterSt === 'all' || o.status === filterSt)
      .filter(o => !search.trim() || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()))
  , [orders, filterSt, search]);

  function changeStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  const totals = { pending: orders.filter(o=>o.status==='pending').length, production: orders.filter(o=>o.status==='production').length, shipped: orders.filter(o=>o.status==='shipped').length };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-brand-400" /> Orders
          </h1>
          <p className="page-description">{orders.length} total orders</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Pending',    count:totals.pending,    color:'text-amber-400',  bg:'bg-amber-500/10',  icon:Clock },
          { label:'Production', count:totals.production, color:'text-brand-400',  bg:'bg-brand-500/10',  icon:Package },
          { label:'Shipped',    count:totals.shipped,    color:'text-blue-400',   bg:'bg-blue-500/10',   icon:Truck },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-sm text-dark-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…" className="input-field pl-9" />
        </div>
        <select value={filterSt} onChange={e => setFilterSt(e.target.value as 'all'|OrderStatus)}
          className="select-field sm:w-44">
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="table-header text-left px-5 py-3">Order</th>
              <th className="table-header text-left px-5 py-3">Customer</th>
              <th className="table-header text-left px-5 py-3">Date</th>
              <th className="table-header text-right px-5 py-3">Total</th>
              <th className="table-header text-center px-5 py-3">Status</th>
              <th className="table-header px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(o => {
              const cfg = STATUS_CONFIG[o.status];
              return (
                <tr key={o.id} className="hover:bg-white/3 transition-colors">
                  <td className="table-cell px-5 font-mono font-medium text-white">{o.id}</td>
                  <td className="table-cell px-5">
                    <div className="font-medium text-white">{o.customer}</div>
                    <div className="text-xs text-dark-500">{o.email}</div>
                  </td>
                  <td className="table-cell px-5 text-dark-300">{o.createdAt}</td>
                  <td className="table-cell px-5 text-right font-medium text-white">ETB {o.total.toLocaleString()}</td>
                  <td className="table-cell px-5 text-center">
                    <span className={cfg.badge}>{cfg.label}</span>
                  </td>
                  <td className="table-cell px-5">
                    <div className="flex gap-2 justify-end">
                      {cfg.next && (
                        <button onClick={() => changeStatus(o.id, cfg.next!)}
                          className="btn-ghost text-xs px-3 py-1.5 text-brand-400 hover:bg-brand-900/30">
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                      <button onClick={() => setSelected(o)} className="btn-ghost text-xs px-3 py-1.5">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No orders match your filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <OrderDetail order={selected} onClose={() => setSelected(null)} onStatusChange={changeStatus} />
        )}
      </AnimatePresence>
    </div>
  );
}
