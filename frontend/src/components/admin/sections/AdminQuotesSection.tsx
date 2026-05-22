'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Eye, X, CheckCircle, Clock, XCircle, Send } from 'lucide-react';

type QuoteStatus = 'new' | 'reviewing' | 'sent' | 'accepted' | 'declined';

interface Quote {
  id: string; customer: string; email: string; phone: string;
  product: string; quantity: number; budget: string;
  details: string; status: QuoteStatus; submittedAt: string;
}

const STATUS_MAP: Record<QuoteStatus, { label: string; badge: string; next?: QuoteStatus }> = {
  new:       { label: 'New',       badge: 'badge-warning', next: 'reviewing' },
  reviewing: { label: 'Reviewing', badge: 'badge-brand',   next: 'sent' },
  sent:      { label: 'Sent',      badge: 'badge-neutral', next: 'accepted' },
  accepted:  { label: 'Accepted',  badge: 'badge-success' },
  declined:  { label: 'Declined',  badge: 'badge-danger' },
};

const SEED: Quote[] = [
  { id:'Q-0055', customer:'Tigist Haile',   email:'tigist@bolepatisserie.et', phone:'0910005005', product:'Cake & Pastry Box',   quantity:500,  budget:'ETB 15,000–20,000', details:'White rigid board with PVC window. Need logo print in 2 colours.',  status:'new',       submittedAt:'2026-05-21' },
  { id:'Q-0054', customer:'Dawit Bekele',   email:'dawit@gecommer.et',        phone:'0921004004', product:'Kraft Paper Bag',      quantity:3000, budget:'ETB 30,000–50,000', details:'Natural kraft. Need gusset sides. Twisted handle preferred.',         status:'reviewing', submittedAt:'2026-05-19' },
  { id:'Q-0053', customer:'New Flower Hotel',email:'procurement@newflower.et', phone:'0116624000', product:'Luxury Ribbon Bag',    quantity:300,  budget:'Negotiable',         details:'Matte black bags, gold foil logo, satin ribbon in dark green.',      status:'sent',      submittedAt:'2026-05-16' },
  { id:'Q-0052', customer:'Eleni Boutique', email:'eleni@eleniboutique.et',   phone:'0944007007', product:'Custom Printed Tote',  quantity:1000, budget:'ETB 20,000',         details:'Full-bleed floral design. Pantone 348 green. Need sample first.',    status:'accepted',  submittedAt:'2026-05-10' },
  { id:'Q-0051', customer:'ABC Pharmacy',   email:'orders@abcpharma.et',      phone:'0911008008', product:'Paper Bags – Small',   quantity:5000, budget:'ETB 25,000',         details:'Plain white kraft, no print. URGENT.',                               status:'declined',  submittedAt:'2026-05-05' },
];

function QuoteModal({ q, onClose, onStatusChange }: { q: Quote; onClose: () => void; onStatusChange: (id: string, s: QuoteStatus) => void }) {
  const cfg = STATUS_MAP[q.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-lg card bg-dark-900 border-white/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">{q.id}</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-dark-500">Customer </span><span className="text-white font-medium">{q.customer}</span></div>
          <div><span className="text-dark-500">Email </span><span className="text-dark-200">{q.email}</span></div>
          <div><span className="text-dark-500">Product </span><span className="text-dark-200">{q.product}</span></div>
          <div><span className="text-dark-500">Quantity </span><span className="text-dark-200">{q.quantity.toLocaleString()}</span></div>
          <div><span className="text-dark-500">Budget </span><span className="text-dark-200">{q.budget}</span></div>
          <div><span className="text-dark-500">Submitted </span><span className="text-dark-200">{q.submittedAt}</span></div>
        </div>
        <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-sm text-dark-200 leading-relaxed">
          {q.details}
        </div>
        <div className="flex items-center gap-3">
          <span className={cfg.badge}>{cfg.label}</span>
          <div className="flex gap-2 ml-auto">
            {cfg.next && (
              <button onClick={() => onStatusChange(q.id, cfg.next!)} className="btn-primary text-xs px-3 py-1.5">
                <Send className="w-3 h-3" /> Advance to {STATUS_MAP[cfg.next].label}
              </button>
            )}
            {q.status !== 'declined' && q.status !== 'accepted' && (
              <button onClick={() => onStatusChange(q.id, 'declined')} className="btn-ghost text-xs px-3 py-1.5 hover:text-red-400">Decline</button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminQuotesSection() {
  const [quotes,  setQuotes]  = useState<Quote[]>(SEED);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState<'all' | QuoteStatus>('all');
  const [viewing, setViewing] = useState<Quote | null>(null);

  const filtered = useMemo(() =>
    quotes
      .filter(q => filter === 'all' || q.status === filter)
      .filter(q => !search.trim() || q.id.includes(search) || q.customer.toLowerCase().includes(search.toLowerCase()))
  , [quotes, filter, search]);

  function changeStatus(id: string, s: QuoteStatus) {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: s } : q));
    setViewing(prev => prev?.id === id ? { ...prev, status: s } : prev);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2"><FileText className="w-6 h-6 text-brand-400" /> Quote Requests</h1>
        <p className="page-description">{quotes.length} quote requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotes…" className="input-field pl-9" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as 'all'|QuoteStatus)} className="select-field sm:w-40">
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_MAP) as QuoteStatus[]).map(s => <option key={s} value={s}>{STATUS_MAP[s].label}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="table-header text-left px-5 py-3">Quote ID</th>
              <th className="table-header text-left px-5 py-3">Customer</th>
              <th className="table-header text-left px-5 py-3">Product</th>
              <th className="table-header text-right px-5 py-3">Qty</th>
              <th className="table-header text-center px-5 py-3">Status</th>
              <th className="table-header px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(q => (
              <tr key={q.id} className="hover:bg-white/3 transition-colors">
                <td className="table-cell px-5 font-mono text-white font-medium">{q.id}</td>
                <td className="table-cell px-5">
                  <div className="font-medium text-white">{q.customer}</div>
                  <div className="text-xs text-dark-500">{q.submittedAt}</div>
                </td>
                <td className="table-cell px-5 text-dark-300">{q.product}</td>
                <td className="table-cell px-5 text-right text-dark-300">{q.quantity.toLocaleString()}</td>
                <td className="table-cell px-5 text-center">
                  <span className={STATUS_MAP[q.status].badge}>{STATUS_MAP[q.status].label}</span>
                </td>
                <td className="table-cell px-5">
                  <button onClick={() => setViewing(q)} className="btn-ghost p-2 ml-auto block"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400"><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No quotes found.</p></div>
        )}
      </div>

      <AnimatePresence>
        {viewing && <QuoteModal q={viewing} onClose={() => setViewing(null)} onStatusChange={changeStatus} />}
      </AnimatePresence>
    </div>
  );
}
