'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Edit2, Trash2, CheckCircle,
  Search, Filter, Download, X, AlertTriangle, Clock,
} from 'lucide-react';
import { useFinanceStore, Transaction, TxType, TxCategory, TxStatus } from '@/store/useFinanceStore';

/* ── Helpers ──────────────────────────────────────────────── */
const fmtETB = (n: number) => `ETB ${n.toLocaleString()}`;

const CATEGORIES: { value: TxCategory; label: string }[] = [
  { value:'product_sale',  label:'Product Sale'   },
  { value:'service_sale',  label:'Service Sale'   },
  { value:'bulk_order',    label:'Bulk Order'     },
  { value:'raw_materials', label:'Raw Materials'  },
  { value:'salaries',      label:'Salaries'       },
  { value:'utilities',     label:'Utilities'      },
  { value:'rent',          label:'Rent'           },
  { value:'transport',     label:'Transport'      },
  { value:'marketing',     label:'Marketing'      },
  { value:'maintenance',   label:'Maintenance'    },
  { value:'tax',           label:'Tax'            },
  { value:'other',         label:'Other'          },
];

const statusColor: Record<TxStatus, string> = {
  paid:      'badge-success',
  pending:   'badge-warning',
  overdue:   'badge-danger',
  cancelled: 'badge-secondary',
};

/* ── Transaction form modal ─────────────────────────────────── */
function TxModal({ tx, onClose }: {
  tx: Partial<Transaction> & { type?: TxType };
  onClose: () => void;
}) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEdit = !!tx.id;

  const [form, setForm] = useState({
    type:         tx.type         ?? 'sale' as TxType,
    category:     tx.category     ?? 'product_sale' as TxCategory,
    title:        tx.title        ?? '',
    amount:       tx.amount       ?? 0,
    status:       tx.status       ?? 'pending' as TxStatus,
    date:         tx.date         ?? new Date().toISOString().slice(0,10),
    dueDate:      tx.dueDate      ?? '',
    counterparty: tx.counterparty ?? '',
    reference:    tx.reference    ?? '',
    notes:        tx.notes        ?? '',
  });

  function save() {
    if (!form.title.trim() || !form.amount) return;
    if (isEdit && tx.id) {
      updateTransaction(tx.id, form);
    } else {
      addTransaction(form);
    }
    onClose();
  }

  const saleCats    = CATEGORIES.filter(c => ['product_sale','service_sale','bulk_order'].includes(c.value));
  const expenseCats = CATEGORIES.filter(c => !['product_sale','service_sale','bulk_order'].includes(c.value));
  const cats        = form.type === 'sale' ? saleCats : expenseCats;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-xl card bg-dark-900 border-white/10 p-6 space-y-5 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['sale','expense'] as TxType[]).map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type:t, category: t==='sale' ? 'product_sale' : 'raw_materials' }))}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${form.type===t ? (t==='sale'?'bg-brand-600 text-white':'bg-red-600/80 text-white') : 'text-dark-400 hover:text-white'}`}>
              {t === 'sale' ? '+ Income / Sale' : '- Expense'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-dark-400 mb-1 block">Title *</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" placeholder="Transaction description" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as TxCategory}))} className="select-field">
              {cats.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Amount (ETB) *</label>
            <input type="number" value={form.amount||''} onChange={e=>setForm(f=>({...f,amount:parseFloat(e.target.value)||0}))} className="input-field" placeholder="0" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="input-field" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className="input-field" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Status</label>
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as TxStatus}))} className="select-field">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Client / Supplier</label>
            <input value={form.counterparty} onChange={e=>setForm(f=>({...f,counterparty:e.target.value}))} className="input-field" placeholder="Name" />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-dark-400 mb-1 block">Reference / Invoice #</label>
            <input value={form.reference} onChange={e=>setForm(f=>({...f,reference:e.target.value}))} className="input-field" placeholder="e.g. ORD-2026-041" />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-dark-400 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} className="input-field resize-none h-20" placeholder="Optional notes…" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="btn-primary flex-1">
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function AdminFinanceSection() {
  const { transactions, deleteTransaction, markPaid, getTotals } = useFinanceStore();
  const totals = getTotals();

  const [tab,     setTab]     = useState<'all'|'sales'|'expenses'>('all');
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [modal,   setModal]   = useState<Partial<Transaction> & { type?: TxType } | null>(null);
  const [confirm, setConfirm] = useState<string|null>(null);

  const filtered = useMemo(() =>
    transactions
      .filter(t => tab==='all' || (tab==='sales' && t.type==='sale') || (tab==='expenses' && t.type==='expense'))
      .filter(t => status==='all' || t.status===status)
      .filter(t => !search.trim() || t.title.toLowerCase().includes(search.toLowerCase()) || (t.counterparty||'').toLowerCase().includes(search.toLowerCase()))
  , [transactions, tab, search, status]);

  function exportCSV() {
    const rows = filtered.map(t => `${t.id},${t.type},${t.category},"${t.title}",${t.amount},${t.status},${t.date},${t.counterparty||''},${t.reference||''}`);
    const blob = new Blob([`ID,Type,Category,Title,Amount,Status,Date,Counterparty,Reference\n${rows.join('\n')}`], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='finance.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><DollarSign className="w-6 h-6 text-brand-400" /> Finance</h1>
          <p className="page-description">Record and manage all sales, expenses, and payments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ type:'expense' })} className="btn-secondary text-sm gap-2"><Plus className="w-4 h-4" /> Expense</button>
          <button onClick={() => setModal({ type:'sale' })}    className="btn-primary  text-sm gap-2"><Plus className="w-4 h-4" /> Sale</button>
        </div>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue',  value:fmtETB(totals.revenue),  icon:TrendingUp,   accent:'#10b981', bg:'#10b98118' },
          { label:'Total Expenses', value:fmtETB(totals.expenses), icon:TrendingDown, accent:'#ef4444', bg:'#ef444418' },
          { label:'Net Profit',     value:fmtETB(totals.profit),   icon:DollarSign,   accent:'#22d3ee', bg:'#22d3ee18' },
          { label:'Pending / Overdue', value:`${fmtETB(totals.pending + totals.overdue)}`, icon:Clock, accent:'#f59e0b', bg:'#f59e0b18' },
        ].map(c => (
          <div key={c.label} className="card p-4 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5" style={{ background:c.accent }} />
            <div className="p-2 rounded-lg w-fit mb-3" style={{ background:c.bg }}>
              <c.icon className="w-4 h-4" style={{ color:c.accent }} />
            </div>
            <div className="font-display font-bold text-xl text-white">{c.value}</div>
            <div className="text-xs text-dark-400 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['all','sales','expenses'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${tab===t?'bg-brand-600 text-white':'text-dark-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…" className="input-field pl-9" />
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="select-field sm:w-36">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button onClick={exportCSV} className="btn-secondary text-xs px-3 py-2 gap-1.5">
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Date','Title','Category','Counterparty','Amount','Status',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-3 text-xs text-dark-400 whitespace-nowrap">{t.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.type==='sale'?'bg-brand-400':'bg-red-400'}`} />
                      <div>
                        <p className="text-sm text-dark-200 font-medium truncate max-w-[200px]">{t.title}</p>
                        {t.reference && <p className="text-xs text-dark-500">{t.reference}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-dark-400 capitalize whitespace-nowrap">{t.category.replace('_',' ')}</td>
                  <td className="px-4 py-3 text-xs text-dark-300 whitespace-nowrap">{t.counterparty || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-bold text-sm ${t.type==='sale'?'text-brand-400':'text-red-400'}`}>
                      {t.type==='sale'?'+':'-'} ETB {t.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusColor[t.status]}>
                      {t.status.charAt(0).toUpperCase()+t.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.status !== 'paid' && (
                        <button onClick={()=>markPaid(t.id)} title="Mark paid" className="p-1.5 rounded-lg hover:bg-brand-600/20 text-brand-400 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={()=>setModal(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={()=>setConfirm(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-dark-400">
              <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal && <TxModal tx={modal} onClose={() => setModal(null)} />}
        {confirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="card bg-dark-900 border-white/10 p-6 max-w-sm w-full space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-dark-200">Delete this transaction? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { deleteTransaction(confirm); setConfirm(null); }}
                  className="btn-danger flex-1 text-sm">Delete</button>
                <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
