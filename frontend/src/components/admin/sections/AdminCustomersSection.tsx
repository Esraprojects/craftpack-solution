'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Eye, X, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';

interface Customer {
  id: string; name: string; email: string; phone: string;
  company: string; city: string; totalOrders: number; totalSpend: number;
  joinedAt: string; lastOrder: string; status: 'active' | 'inactive';
}

const SEED: Customer[] = [
  { id:'c1', name:'Abebe Girma',       email:'abebe@kaldis.et',         phone:'0911001001', company:"Kaldi's Coffee",     city:'Addis Ababa', totalOrders:12, totalSpend:432000, joinedAt:'2024-03-10', lastOrder:'2026-05-18', status:'active' },
  { id:'c2', name:'Sarah Johnson',     email:'sjohnson@hyatt.com',      phone:'0115505050', company:'Hyatt Regency',      city:'Addis Ababa', totalOrders:8,  totalSpend:140000, joinedAt:'2024-06-15', lastOrder:'2026-05-15', status:'active' },
  { id:'c3', name:'Meseret Alemu',     email:'meseret@safeway.et',      phone:'0919003003', company:'Safeway Supermarket',city:'Addis Ababa', totalOrders:24, totalSpend:1680000,joinedAt:'2023-11-20', lastOrder:'2026-05-14', status:'active' },
  { id:'c4', name:'Dawit Bekele',      email:'dawit@gecommer.et',       phone:'0921004004', company:'Getu Commercial',    city:'Adama',       totalOrders:5,  totalSpend:165000, joinedAt:'2025-01-05', lastOrder:'2026-05-20', status:'active' },
  { id:'c5', name:'Tigist Haile',      email:'tigist@bolepatisserie.et',phone:'0910005005', company:'Bole Patisserie',    city:'Addis Ababa', totalOrders:3,  totalSpend:12000,  joinedAt:'2025-04-12', lastOrder:'2026-05-21', status:'active' },
  { id:'c6', name:'Yohannes Tadesse',  email:'yohannes@dashen.com',     phone:'0115600056', company:'Dashen Bank',        city:'Addis Ababa', totalOrders:2,  totalSpend:44000,  joinedAt:'2025-02-20', lastOrder:'2026-05-01', status:'inactive' },
  { id:'c7', name:'Frehiwot Tesfaye',  email:'frehiwot@alem.et',        phone:'0933006006', company:'Alem Clothing',      city:'Addis Ababa', totalOrders:1,  totalSpend:0,      joinedAt:'2025-03-14', lastOrder:'2026-04-28', status:'inactive' },
];

function CustomerModal({ c, onClose }: { c: Customer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-lg card bg-dark-900 border-white/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-900/40 border border-brand-800/30 flex items-center justify-center font-bold text-brand-400 text-lg">
              {c.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{c.name}</h3>
              <p className="text-sm text-dark-400">{c.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { icon: Mail,  label:'Email',      value: c.email },
            { icon: Phone, label:'Phone',      value: c.phone },
            { icon: MapPin,label:'City',       value: c.city },
            { icon: ShoppingCart, label:'Orders', value: c.totalOrders.toString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
              <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-dark-500">{label}</p>
                <p className="text-white font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-brand-900/20 border border-brand-800/30 flex justify-between items-center">
          <span className="text-dark-300 text-sm">Total Spend</span>
          <span className="font-bold text-brand-400 text-xl">ETB {c.totalSpend.toLocaleString()}</span>
        </div>
        <p className="text-xs text-dark-500">Member since {c.joinedAt} · Last order {c.lastOrder}</p>
      </motion.div>
    </div>
  );
}

export default function AdminCustomersSection() {
  const [customers] = useState<Customer[]>(SEED);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [viewing, setViewing] = useState<Customer | null>(null);

  const filtered = useMemo(() =>
    customers
      .filter(c => filter === 'all' || c.status === filter)
      .filter(c => !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()))
  , [customers, filter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2"><Users className="w-6 h-6 text-brand-400" /> Customers</h1>
        <p className="page-description">{customers.length} registered customers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" className="input-field pl-9" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select-field sm:w-36">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[660px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="table-header text-left px-5 py-3">Customer</th>
              <th className="table-header text-left px-5 py-3">Company</th>
              <th className="table-header text-right px-5 py-3">Orders</th>
              <th className="table-header text-right px-5 py-3">Total Spend</th>
              <th className="table-header text-center px-5 py-3">Status</th>
              <th className="table-header px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/3 transition-colors">
                <td className="table-cell px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-900/40 border border-brand-800/30 flex items-center justify-center font-bold text-brand-400 text-sm flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-dark-500">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell px-5 text-dark-300">{c.company}</td>
                <td className="table-cell px-5 text-right text-white font-medium">{c.totalOrders}</td>
                <td className="table-cell px-5 text-right font-medium text-white">ETB {c.totalSpend.toLocaleString()}</td>
                <td className="table-cell px-5 text-center">
                  <span className={c.status === 'active' ? 'badge-success' : 'badge-neutral'}>{c.status}</span>
                </td>
                <td className="table-cell px-5">
                  <button onClick={() => setViewing(c)} className="btn-ghost p-2 ml-auto block"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No customers found.</p></div>
        )}
      </div>

      <AnimatePresence>
        {viewing && <CustomerModal c={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </div>
  );
}
