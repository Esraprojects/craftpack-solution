import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReminderPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReminderCategory = 'salary' | 'supplier' | 'tax' | 'utility' | 'rent' | 'loan' | 'maintenance' | 'meeting' | 'other';
export type RecurringFreq    = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  dueDate: string;
  amount?: number;
  recipient?: string;
  email?: string;
  recurring: RecurringFreq;
  done: boolean;
  snoozedUntil?: string;
  createdAt: string;
}

interface ReminderState {
  reminders: Reminder[];
  addReminder:    (r: Omit<Reminder, 'id' | 'createdAt' | 'done'>) => void;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>) => void;
  deleteReminder: (id: string) => void;
  toggleDone:     (id: string) => void;
  snooze:         (id: string, until: string) => void;
  getOverdue:     () => Reminder[];
  getUpcoming:    (days: number) => Reminder[];
}

const today = '2026-05-22';

const SEED: Reminder[] = [
  { id:'REM-001', title:'Staff Salary Payment — June 2026', category:'salary',   priority:'critical', dueDate:'2026-06-10', amount:68000, recipient:'All Staff',             recurring:'monthly', done:false, createdAt:'2026-05-01',  description:'Monthly payroll for all factory and office staff.' },
  { id:'REM-002', title:'Kraft Paper Supplier Invoice',     category:'supplier',  priority:'high',     dueDate:'2026-05-28', amount:42000, recipient:'Ethio Paper Supply Co.', recurring:'monthly', done:false, createdAt:'2026-05-15',  description:'Monthly raw material invoice. Pay before end of month to avoid interest.' },
  { id:'REM-003', title:'Factory Rent — Gofa Camp',        category:'rent',      priority:'high',     dueDate:'2026-06-01', amount:25000, recipient:'Gofa Property Owner',    recurring:'monthly', done:false, createdAt:'2026-05-01',  description:'Monthly factory rent for Gofa Camp location.' },
  { id:'REM-004', title:'Electricity & Water Bill',        category:'utility',   priority:'medium',   dueDate:'2026-05-30', amount:13000,                                      recurring:'monthly', done:false, createdAt:'2026-05-20' },
  { id:'REM-005', title:'VAT Filing — Q2 2026',            category:'tax',       priority:'critical', dueDate:'2026-06-15', recipient:'Ethiopian Revenue Authority',            recurring:'none',    done:false, createdAt:'2026-05-10',  description:'Quarterly VAT filing. Gather all invoices and prepare declaration.' },
  { id:'REM-006', title:'Ink & Dye Supplier Payment',      category:'supplier',  priority:'medium',   dueDate:'2026-05-25', amount:18500, recipient:'Color Tech Ethiopia',     recurring:'monthly', done:false, createdAt:'2026-05-18' },
  { id:'REM-007', title:'Equipment Maintenance Check',     category:'maintenance',priority:'low',     dueDate:'2026-06-05',                                                     recurring:'monthly', done:false, createdAt:'2026-05-01',  description:'Monthly check on printing press and die-cut machines.' },
  { id:'REM-008', title:'Vehicle Insurance Renewal',       category:'other',     priority:'high',     dueDate:'2026-07-01', amount:9200,  recipient:'Ethiopian Insurance Co.',  recurring:'yearly',  done:false, createdAt:'2026-05-22',  description:'Annual renewal for 2 delivery vans.' },
  { id:'REM-009', title:'Supplier Payment — Ink Cartridges', category:'supplier', priority:'medium',  dueDate:'2026-05-20', amount:7800,  recipient:'PrintTech Solutions',     recurring:'none',    done:true,  createdAt:'2026-05-10' },
];

let rCounter = 10;

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: SEED,

      addReminder: (r) => {
        const id = `REM-${String(rCounter++).padStart(3, '0')}`;
        set(s => ({
          reminders: [
            { ...r, id, done: false, createdAt: new Date().toISOString().slice(0, 10) },
            ...s.reminders,
          ],
        }));
      },

      updateReminder: (id, updates) =>
        set(s => ({ reminders: s.reminders.map(r => r.id === id ? { ...r, ...updates } : r) })),

      deleteReminder: (id) =>
        set(s => ({ reminders: s.reminders.filter(r => r.id !== id) })),

      toggleDone: (id) =>
        set(s => ({ reminders: s.reminders.map(r => r.id === id ? { ...r, done: !r.done } : r) })),

      snooze: (id, until) =>
        set(s => ({ reminders: s.reminders.map(r => r.id === id ? { ...r, snoozedUntil: until } : r) })),

      getOverdue: () => {
        const now = new Date().toISOString().slice(0, 10);
        return get().reminders.filter(r => !r.done && r.dueDate < now);
      },

      getUpcoming: (days) => {
        const now = new Date();
        const target = new Date(now);
        target.setDate(target.getDate() + days);
        const targetStr = target.toISOString().slice(0, 10);
        const nowStr    = now.toISOString().slice(0, 10);
        return get().reminders.filter(r => !r.done && r.dueDate >= nowStr && r.dueDate <= targetStr);
      },
    }),
    { name: 'craftpack-reminders' },
  ),
);
