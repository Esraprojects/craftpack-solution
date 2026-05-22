'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Eye, X, Reply, CheckCircle } from 'lucide-react';

interface Inquiry {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; read: boolean; replied: boolean; receivedAt: string;
}

const SEED: Inquiry[] = [
  { id:'INQ-081', name:'Bemnet Worku',   email:'bemnet@gmail.com',         phone:'0944001001', subject:'Bulk Order Enquiry',         message:'We need 20,000 paper bags for our supermarket chain. Can you handle that volume and what is your best price?', read:false, replied:false, receivedAt:'2026-05-21' },
  { id:'INQ-080', name:'Liya Tadesse',   email:'liya@liyandesign.com',     phone:'0911002002', subject:'Custom Design Question',      message:'Do you offer in-house design services? We have a complex logo that needs to be printed on the bags.', read:true,  replied:false, receivedAt:'2026-05-20' },
  { id:'INQ-079', name:'Mohammed Ali',   email:'mohammedali@bole.et',      phone:'0933003003', subject:'Sample Request',              message:'Hi, I would like to request samples of your eco-friendly bag range before placing a large order. Is this possible?', read:true,  replied:true,  receivedAt:'2026-05-19' },
  { id:'INQ-078', name:'Hana Tesfaye',   email:'hana@hanaevents.com',      phone:'0921004004', subject:'Event Packaging',             message:'We organise corporate events and need premium branded bags for 500 guests. What options do you have?', read:true,  replied:true,  receivedAt:'2026-05-17' },
  { id:'INQ-077', name:'Tariku Girma',   email:'tariku@freshmart.et',      phone:'0910005005', subject:'Price List',                  message:'Please send me your full product catalogue with current pricing. Thank you.', read:false, replied:false, receivedAt:'2026-05-16' },
];

function InquiryModal({ inq, onClose, onMark }: {
  inq: Inquiry; onClose: () => void;
  onMark: (id: string, field: 'read' | 'replied', v: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-lg card bg-dark-900 border-white/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">{inq.subject}</h3>
            <p className="text-sm text-dark-400">{inq.id} · {inq.receivedAt}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-dark-500">From </span><span className="text-white font-medium">{inq.name}</span></div>
          <div><span className="text-dark-500">Email </span><span className="text-dark-200">{inq.email}</span></div>
          <div><span className="text-dark-500">Phone </span><span className="text-dark-200">{inq.phone}</span></div>
        </div>
        <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-sm text-dark-200 leading-relaxed">
          {inq.message}
        </div>
        <div className="flex gap-3">
          {!inq.replied && (
            <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}
              className="btn-primary flex-1 text-sm"
              onClick={() => onMark(inq.id, 'replied', true)}>
              <Reply className="w-4 h-4" /> Reply via Email
            </a>
          )}
          {!inq.read && (
            <button onClick={() => onMark(inq.id, 'read', true)} className="btn-secondary text-sm">
              <CheckCircle className="w-4 h-4" /> Mark Read
            </button>
          )}
          {inq.replied && <span className="badge-success self-center">Replied</span>}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminInquiriesSection() {
  const [items,   setItems]   = useState<Inquiry[]>(SEED);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [viewing, setViewing] = useState<Inquiry | null>(null);

  const filtered = useMemo(() =>
    items
      .filter(i => filter === 'all' || (filter === 'unread' && !i.read) || (filter === 'unreplied' && !i.replied))
      .filter(i => !search.trim() || i.subject.toLowerCase().includes(search.toLowerCase()) || i.name.toLowerCase().includes(search.toLowerCase()))
  , [items, filter, search]);

  function mark(id: string, field: 'read'|'replied', v: boolean) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: v } : i));
    setViewing(prev => prev?.id === id ? { ...prev, [field]: v } : prev);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2"><MessageSquare className="w-6 h-6 text-brand-400" /> Inquiries</h1>
        <p className="page-description">{items.filter(i => !i.read).length} unread inquiries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inquiries…" className="input-field pl-9" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select-field sm:w-40">
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="unreplied">Unreplied</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(i => (
          <div key={i.id}
            className={`card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:border-brand-800/40 ${!i.read ? 'border-brand-700/30' : ''}`}
            onClick={() => { mark(i.id, 'read', true); setViewing(i); }}>
            <div className="flex items-center gap-3">
              {!i.read && <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />}
              <div className={!i.read ? 'pl-0' : 'pl-5'}>
                <p className={`font-medium ${!i.read ? 'text-white' : 'text-dark-200'}`}>{i.subject}</p>
                <p className="text-sm text-dark-400">{i.name} · {i.email}</p>
                <p className="text-xs text-dark-500 mt-0.5 line-clamp-1">{i.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <span className="text-xs text-dark-500">{i.receivedAt}</span>
              {i.replied && <span className="badge-success">Replied</span>}
              {!i.replied && <span className="badge-warning">Pending</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No inquiries found.</p></div>
        )}
      </div>

      <AnimatePresence>
        {viewing && <InquiryModal inq={viewing} onClose={() => setViewing(null)} onMark={mark} />}
      </AnimatePresence>
    </div>
  );
}
