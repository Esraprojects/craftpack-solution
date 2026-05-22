'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, Clock,
  X, Mail, RefreshCw, Calendar, DollarSign,
} from 'lucide-react';
import {
  useReminderStore, Reminder,
  ReminderPriority, ReminderCategory, RecurringFreq,
} from '@/store/useReminderStore';

/* ── Helpers ──────────────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);

const isOverdue  = (r: Reminder) => !r.done && r.dueDate < today;
const isDueToday = (r: Reminder) => !r.done && r.dueDate === today;
const isDueSoon  = (r: Reminder) => {
  if (r.done || r.dueDate < today) return false;
  const diff = (new Date(r.dueDate).getTime() - Date.now()) / 86400000;
  return diff <= 7;
};

const priorityColor: Record<ReminderPriority, string> = {
  low:      'badge-secondary',
  medium:   'badge-warning',
  high:     'badge-danger',
  critical: 'text-xs font-bold px-2 py-0.5 rounded-full bg-red-600/30 text-red-300',
};

const categoryIcon: Record<ReminderCategory, React.ElementType> = {
  salary:      DollarSign,
  supplier:    RefreshCw,
  tax:         AlertTriangle,
  utility:     Clock,
  rent:        Calendar,
  loan:        DollarSign,
  maintenance: RefreshCw,
  meeting:     Calendar,
  other:       Bell,
};

const CATEGORIES: { value: ReminderCategory; label: string }[] = [
  { value:'salary',      label:'Salary Payment'    },
  { value:'supplier',    label:'Supplier Payment'  },
  { value:'tax',         label:'Tax / Legal'       },
  { value:'utility',     label:'Utilities'         },
  { value:'rent',        label:'Rent'              },
  { value:'loan',        label:'Loan Payment'      },
  { value:'maintenance', label:'Maintenance'       },
  { value:'meeting',     label:'Meeting / Event'   },
  { value:'other',       label:'Other'             },
];

/* ── Calendar strip ─────────────────────────────────────────── */
function CalendarStrip({ reminders }: { reminders: Reminder[] }) {
  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now); d.setDate(now.getDate() + i);
      const str = d.toISOString().slice(0, 10);
      const dayRems = reminders.filter(r => !r.done && r.dueDate === str);
      arr.push({ str, day: d.getDate(), weekDay: d.toLocaleDateString('en-US',{weekday:'short'}), count: dayRems.length });
    }
    return arr;
  }, [reminders]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {days.map(d => (
        <div key={d.str} className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all min-w-[48px]
          ${d.str === today ? 'border-brand-500/60 bg-brand-500/10' : d.count > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 bg-transparent'}`}>
          <span className="text-xs text-dark-500">{d.weekDay}</span>
          <span className={`text-sm font-bold ${d.str === today ? 'text-brand-400' : 'text-dark-200'}`}>{d.day}</span>
          {d.count > 0 && (
            <span className={`w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center ${d.str === today ? 'bg-brand-500 text-white' : 'bg-amber-500/80 text-white'}`}>
              {d.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Reminder form modal ────────────────────────────────────── */
function ReminderModal({ rem, onClose }: { rem: Partial<Reminder>; onClose: () => void }) {
  const { addReminder, updateReminder } = useReminderStore();
  const isEdit = !!rem.id;

  const [form, setForm] = useState({
    title:       rem.title       ?? '',
    description: rem.description ?? '',
    category:    rem.category    ?? 'salary'    as ReminderCategory,
    priority:    rem.priority    ?? 'medium'    as ReminderPriority,
    dueDate:     rem.dueDate     ?? today,
    amount:      rem.amount      ?? 0,
    recipient:   rem.recipient   ?? '',
    email:       rem.email       ?? '',
    recurring:   rem.recurring   ?? 'none'      as RecurringFreq,
  });

  function save() {
    if (!form.title.trim()) return;
    if (isEdit && rem.id) {
      updateReminder(rem.id, form);
    } else {
      addReminder(form);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-lg card bg-dark-900 border-white/10 p-6 space-y-5 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">{isEdit ? 'Edit Reminder' : 'New Reminder'}</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-dark-400 mb-1 block">Title *</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" placeholder="e.g. Staff Salary — June 2026" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as ReminderCategory}))} className="select-field">
              {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Priority</label>
            <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value as ReminderPriority}))} className="select-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Due Date *</label>
            <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className="input-field" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Amount (ETB)</label>
            <input type="number" value={form.amount||''} onChange={e=>setForm(f=>({...f,amount:parseFloat(e.target.value)||0}))} className="input-field" placeholder="Optional" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Recipient / Payee</label>
            <input value={form.recipient} onChange={e=>setForm(f=>({...f,recipient:e.target.value}))} className="input-field" placeholder="Name" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Email (for notification)</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="input-field" placeholder="email@example.com" />
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1 block">Recurring</label>
            <select value={form.recurring} onChange={e=>setForm(f=>({...f,recurring:e.target.value as RecurringFreq}))} className="select-field">
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs text-dark-400 mb-1 block">Notes</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="input-field resize-none h-20" placeholder="Optional details…" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="btn-primary flex-1">{isEdit ? 'Save Changes' : 'Add Reminder'}</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Reminder card ─────────────────────────────────────────── */
function ReminderCard({ rem, onEdit, onDelete, onToggle, onEmail }: {
  rem: Reminder;
  onEdit:   () => void;
  onDelete: () => void;
  onToggle: () => void;
  onEmail:  () => void;
}) {
  const overdue  = isOverdue(rem);
  const dueToday = isDueToday(rem);
  const dueSoon  = isDueSoon(rem);
  const IconComp = categoryIcon[rem.category];

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.97 }}
      className={`card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all
        ${overdue ? 'border-red-500/30 bg-red-500/3' : dueToday ? 'border-amber-500/40' : rem.done ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start sm:items-center gap-3">
        <button onClick={onToggle} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 transition-colors
          ${rem.done ? 'bg-brand-500 border-brand-500' : overdue ? 'border-red-400 hover:border-red-300' : 'border-dark-600 hover:border-brand-500'}`}>
          {rem.done && <CheckCircle className="w-3.5 h-3.5 text-white fill-current" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${rem.done ? 'line-through text-dark-500' : 'text-dark-200'}`}>{rem.title}</span>
            <span className={priorityColor[rem.priority]}>{rem.priority}</span>
            {overdue  && <span className="badge-danger">Overdue</span>}
            {dueToday && !overdue && <span className="badge-warning">Due Today</span>}
            {rem.recurring !== 'none' && <span className="badge-secondary flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5" />{rem.recurring}</span>}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-dark-500">
              <Calendar className="w-3 h-3" /> {rem.dueDate}
            </span>
            {rem.amount ? (
              <span className="flex items-center gap-1 text-xs text-dark-400">
                <DollarSign className="w-3 h-3" /> ETB {rem.amount.toLocaleString()}
              </span>
            ) : null}
            {rem.recipient && <span className="text-xs text-dark-500">{rem.recipient}</span>}
          </div>
          {rem.description && <p className="text-xs text-dark-500 mt-1 line-clamp-1">{rem.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
        <div className="p-2 rounded-xl bg-white/3">
          <IconComp className="w-4 h-4 text-dark-400" />
        </div>
        {rem.email && (
          <button onClick={onEmail} title="Send email reminder" className="p-2 rounded-xl hover:bg-accent-600/20 text-dark-400 hover:text-accent-400 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
        )}
        <button onClick={onEdit} className="p-2 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-xl hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function AdminRemindersSection() {
  const { reminders, deleteReminder, toggleDone, getOverdue } = useReminderStore();

  const [filter, setFilter]   = useState<'all'|'pending'|'done'|'overdue'>('all');
  const [catFilter, setCat]   = useState<ReminderCategory|'all'>('all');
  const [modal, setModal]     = useState<Partial<Reminder>|null>(null);
  const [confirm, setConfirm] = useState<string|null>(null);

  const overdueCount = getOverdue().length;
  const upcomingCount = reminders.filter(r => isDueSoon(r) && !isOverdue(r)).length;

  const filtered = useMemo(() =>
    reminders
      .filter(r => filter==='all' || (filter==='pending' && !r.done && !isOverdue(r)) || (filter==='done' && r.done) || (filter==='overdue' && isOverdue(r)))
      .filter(r => catFilter==='all' || r.category===catFilter)
      .sort((a,b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return a.dueDate.localeCompare(b.dueDate);
      })
  , [reminders, filter, catFilter]);

  function sendEmail(rem: Reminder) {
    if (!rem.email) return;
    const subject = encodeURIComponent(`Reminder: ${rem.title}`);
    const body    = encodeURIComponent(
      `Dear ${rem.recipient || 'Team'},\n\nThis is a reminder for: ${rem.title}\nDue Date: ${rem.dueDate}${rem.amount ? `\nAmount: ETB ${rem.amount.toLocaleString()}` : ''}\n\n${rem.description || ''}\n\nCraftpack Solution`
    );
    window.open(`mailto:${rem.email}?subject=${subject}&body=${body}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><Bell className="w-6 h-6 text-brand-400" /> Reminders</h1>
          <p className="page-description">Track payments, salaries, and recurring obligations</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary text-sm gap-2">
          <Plus className="w-4 h-4" /> New Reminder
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> {overdueCount} overdue reminder{overdueCount>1?'s':''}
          </div>
        )}
        {upcomingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm font-medium">
            <Clock className="w-4 h-4" /> {upcomingCount} due within 7 days
          </div>
        )}
      </div>

      {/* Calendar strip */}
      <div className="card p-4 space-y-3">
        <h2 className="text-sm font-medium text-dark-300 flex items-center gap-2"><Calendar className="w-4 h-4" /> Upcoming 14 Days</h2>
        <CalendarStrip reminders={reminders} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['all','pending','overdue','done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${filter===f?'bg-brand-600 text-white':'text-dark-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <select value={catFilter} onChange={e=>setCat(e.target.value as ReminderCategory|'all')} className="select-field sm:w-44">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(r => (
            <ReminderCard
              key={r.id}
              rem={r}
              onEdit={() => setModal(r)}
              onDelete={() => setConfirm(r.id)}
              onToggle={() => toggleDone(r.id)}
              onEmail={() => sendEmail(r)}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No reminders found.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal && <ReminderModal rem={modal} onClose={() => setModal(null)} />}
        {confirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="card bg-dark-900 border-white/10 p-6 max-w-sm w-full space-y-4">
              <p className="text-sm text-dark-200 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                Delete this reminder permanently?
              </p>
              <div className="flex gap-3">
                <button onClick={() => { deleteReminder(confirm); setConfirm(null); }} className="btn-danger flex-1 text-sm">Delete</button>
                <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
