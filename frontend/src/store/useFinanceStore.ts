import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TxType    = 'sale' | 'expense';
export type TxStatus  = 'paid' | 'pending' | 'overdue' | 'cancelled';
export type TxCategory =
  | 'product_sale' | 'service_sale' | 'bulk_order'
  | 'raw_materials' | 'salaries' | 'utilities' | 'rent' | 'transport'
  | 'marketing' | 'maintenance' | 'tax' | 'other';

export interface Transaction {
  id: string;
  type: TxType;
  category: TxCategory;
  title: string;
  amount: number;
  status: TxStatus;
  date: string;
  dueDate?: string;
  paidDate?: string;
  notes?: string;
  counterparty?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceState {
  transactions: Transaction[];
  addTransaction:    (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  markPaid:          (id: string) => void;
  getTotals: () => { revenue: number; expenses: number; profit: number; pending: number; overdue: number };
  getByMonth: (year: number, month: number) => Transaction[];
}

const SEED: Transaction[] = [
  { id:'TXN-2026-0541', type:'sale',    category:'bulk_order',    title:'Sunrise Hotel — Bulk Bag Order',    amount:48500, status:'paid',    date:'2026-05-20', paidDate:'2026-05-20', counterparty:'Sunrise Hotel', reference:'ORD-2026-041', createdAt:'2026-05-20', updatedAt:'2026-05-20' },
  { id:'TXN-2026-0540', type:'sale',    category:'product_sale',  title:'Bole Coffee — Custom Branded Bags', amount:22000, status:'paid',    date:'2026-05-18', paidDate:'2026-05-19', counterparty:'Bole Coffee Roasters', reference:'ORD-2026-038', createdAt:'2026-05-18', updatedAt:'2026-05-19' },
  { id:'TXN-2026-0539', type:'expense', category:'raw_materials', title:'Kraft Paper Roll — Supplier Invoice', amount:35000, status:'paid',   date:'2026-05-15', paidDate:'2026-05-16', counterparty:'Ethio Paper Supply Co.', reference:'SUP-2026-112', createdAt:'2026-05-15', updatedAt:'2026-05-16' },
  { id:'TXN-2026-0538', type:'expense', category:'salaries',      title:'Staff Salaries — May 2026',          amount:68000, status:'paid',   date:'2026-05-10', paidDate:'2026-05-10', counterparty:'Staff Payroll', createdAt:'2026-05-10', updatedAt:'2026-05-10' },
  { id:'TXN-2026-0537', type:'sale',    category:'service_sale',  title:'Custom Design Service — Hana Events', amount:8500, status:'pending', date:'2026-05-12', dueDate:'2026-05-28', counterparty:'Hana Events', reference:'SVC-2026-019', createdAt:'2026-05-12', updatedAt:'2026-05-12' },
  { id:'TXN-2026-0536', type:'sale',    category:'bulk_order',    title:'Freshmart Supermarket — Monthly Order', amount:75000, status:'pending', date:'2026-05-08', dueDate:'2026-05-25', counterparty:'Freshmart Supermarket', reference:'ORD-2026-035', createdAt:'2026-05-08', updatedAt:'2026-05-08' },
  { id:'TXN-2026-0535', type:'expense', category:'utilities',     title:'Electricity & Water — April 2026',    amount:12400, status:'paid',   date:'2026-05-05', paidDate:'2026-05-05', createdAt:'2026-05-05', updatedAt:'2026-05-05' },
  { id:'TXN-2026-0534', type:'expense', category:'rent',          title:'Factory Rent — May 2026',             amount:25000, status:'paid',   date:'2026-05-01', paidDate:'2026-05-01', counterparty:'Gofa Property', createdAt:'2026-05-01', updatedAt:'2026-05-01' },
  { id:'TXN-2026-0533', type:'sale',    category:'bulk_order',    title:'Anbessa Garment — Shopping Bags',     amount:31000, status:'overdue', date:'2026-04-28', dueDate:'2026-05-14', counterparty:'Anbessa Garment', reference:'ORD-2026-030', createdAt:'2026-04-28', updatedAt:'2026-04-28' },
  { id:'TXN-2026-0532', type:'expense', category:'transport',     title:'Delivery Fleet — Fuel & Maintenance', amount:9800, status:'paid',    date:'2026-04-25', paidDate:'2026-04-26', createdAt:'2026-04-25', updatedAt:'2026-04-26' },
  { id:'TXN-2026-0531', type:'expense', category:'marketing',     title:'Social Media Ads — April',           amount:6500, status:'paid',    date:'2026-04-20', paidDate:'2026-04-20', createdAt:'2026-04-20', updatedAt:'2026-04-20' },
  { id:'TXN-2026-0530', type:'sale',    category:'product_sale',  title:'Al Ameen Café — Carry Bags',          amount:14500, status:'paid', date:'2026-04-18', paidDate:'2026-04-19', counterparty:'Al Ameen Café', reference:'ORD-2026-027', createdAt:'2026-04-18', updatedAt:'2026-04-19' },
];

let counter = 529;

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: SEED,

      addTransaction: (tx) => {
        counter--;
        const now = new Date().toISOString().slice(0, 10);
        set(s => ({
          transactions: [
            {
              ...tx,
              id: `TXN-${new Date().getFullYear()}-0${counter}`,
              createdAt: now,
              updatedAt: now,
            },
            ...s.transactions,
          ],
        }));
      },

      updateTransaction: (id, updates) =>
        set(s => ({
          transactions: s.transactions.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().slice(0, 10) } : t,
          ),
        })),

      deleteTransaction: (id) =>
        set(s => ({ transactions: s.transactions.filter(t => t.id !== id) })),

      markPaid: (id) =>
        set(s => ({
          transactions: s.transactions.map(t =>
            t.id === id
              ? { ...t, status: 'paid', paidDate: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) }
              : t,
          ),
        })),

      getTotals: () => {
        const txs = get().transactions;
        const revenue  = txs.filter(t => t.type === 'sale'    && t.status === 'paid').reduce((s, t) => s + t.amount, 0);
        const expenses = txs.filter(t => t.type === 'expense' && t.status === 'paid').reduce((s, t) => s + t.amount, 0);
        const pending  = txs.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
        const overdue  = txs.filter(t => t.status === 'overdue').reduce((s, t) => s + t.amount, 0);
        return { revenue, expenses, profit: revenue - expenses, pending, overdue };
      },

      getByMonth: (year, month) =>
        get().transactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        }),
    }),
    { name: 'craftpack-finance' },
  ),
);
