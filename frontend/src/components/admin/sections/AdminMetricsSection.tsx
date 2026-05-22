'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingBag,
  BarChart2, Download, RefreshCw, Sparkles, AlertTriangle, CheckCircle, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/* ── Helpers ──────────────────────────────────────────────── */
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `${(n/1_000).toFixed(1)}K`     : `${n}`;

const fmtETB = (n: number) => `ETB ${fmt(n)}`;

/* ── Seed data ─────────────────────────────────────────────── */
const monthlyRevenue = [
  { month:'Nov', revenue:182000, expenses:112000, profit:70000, orders:38 },
  { month:'Dec', revenue:224000, expenses:131000, profit:93000, orders:47 },
  { month:'Jan', revenue:165000, expenses:105000, profit:60000, orders:31 },
  { month:'Feb', revenue:198000, expenses:119000, profit:79000, orders:42 },
  { month:'Mar', revenue:245000, expenses:138000, profit:107000, orders:55 },
  { month:'Apr', revenue:271000, expenses:145000, profit:126000, orders:61 },
  { month:'May', revenue:312000, expenses:168000, profit:144000, orders:74 },
];

const weeklyOrders = [
  { day:'Mon', orders:9,  revenue:42000 },
  { day:'Tue', orders:14, revenue:67000 },
  { day:'Wed', orders:11, revenue:51000 },
  { day:'Thu', orders:18, revenue:88000 },
  { day:'Fri', orders:22, revenue:105000 },
  { day:'Sat', orders:16, revenue:79000 },
];

const categoryPie = [
  { name:'Paper Bags',       value:38, color:'#10b981' },
  { name:'Cake Boxes',       value:22, color:'#22d3ee' },
  { name:'Gift Bags',        value:18, color:'#f59e0b' },
  { name:'Custom Printed',   value:14, color:'#8b5cf6' },
  { name:'Eco Packaging',    value:8,  color:'#ec4899' },
];

const topProducts = [
  { name:'Kraft Paper Bag (Medium)',  sales:1840, revenue:73600, trend:'+12%' },
  { name:'Luxury Gift Box',          sales:920,  revenue:55200, trend:'+28%' },
  { name:'Custom Printed Bag',       sales:760,  revenue:91200, trend:'+8%'  },
  { name:'Cake Box (Assorted)',      sales:640,  revenue:32000, trend:'+5%'  },
  { name:'Eco Tote Bag',            sales:580,  revenue:23200, trend:'+41%' },
];

const aiInsights = [
  { type:'success', icon:CheckCircle, text:'Revenue is up 15.1% vs last month. June forecast: ETB 358,000 at current trajectory.', color:'text-brand-400' },
  { type:'warning', icon:AlertTriangle, text:'3 invoices totalling ETB 116,500 are overdue. Follow up with Anbessa Garment immediately.', color:'text-amber-400' },
  { type:'info',    icon:Sparkles, text:'Eco Tote Bag is your fastest-growing product (+41%). Consider increasing inventory.', color:'text-accent-400' },
  { type:'info',    icon:TrendingUp, text:'Friday is your highest-revenue day. Consider scheduling large deliveries mid-week to free Friday capacity.', color:'text-purple-400' },
];

/* ── KPI Card ──────────────────────────────────────────────── */
function KpiCard({ label, value, sub, trend, up, icon: Icon, accent }: {
  label: string; value: string; sub?: string; trend?: string; up?: boolean;
  icon: React.ElementType; accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      className="card p-5 space-y-3 relative overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl" style={{ background: `${accent}18` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${up ? 'text-brand-400' : 'text-red-400'}`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="font-display font-bold text-2xl text-white">{value}</div>
        <div className="text-xs text-dark-400 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-dark-500 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ── Custom Tooltip ────────────────────────────────────────── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: {name:string;value:number;color:string}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark rounded-xl px-4 py-3 shadow-2xl text-xs space-y-1 border border-white/10">
      <p className="text-dark-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-dark-400">{p.name}:</span>
          <span className="text-white font-bold">{typeof p.value === 'number' && p.value > 999 ? fmtETB(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Export helper ─────────────────────────────────────────── */
function exportCSV(data: Record<string,unknown>[], name: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows    = data.map(r => Object.values(r).join(',')).join('\n');
  const blob    = new Blob([`${headers}\n${rows}`], { type:'text/csv' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href = url; a.download = `${name}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ── Main component ────────────────────────────────────────── */
export default function AdminMetricsSection() {
  const [period, setPeriod] = useState<'weekly'|'monthly'>('monthly');

  const kpis = useMemo(() => {
    const cur = monthlyRevenue[monthlyRevenue.length - 1];
    const prv = monthlyRevenue[monthlyRevenue.length - 2];
    const revTrend  = (((cur.revenue  - prv.revenue)  / prv.revenue)  * 100).toFixed(1);
    const profTrend = (((cur.profit   - prv.profit)   / prv.profit)   * 100).toFixed(1);
    const ordTrend  = (((cur.orders   - prv.orders)   / prv.orders)   * 100).toFixed(1);
    const margin    = ((cur.profit / cur.revenue) * 100).toFixed(1);
    return { cur, prv, revTrend, profTrend, ordTrend, margin };
  }, []);

  const chartData = period === 'monthly' ? monthlyRevenue : weeklyOrders;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-brand-400" /> Business Metrics
          </h1>
          <p className="page-description">Live analytics, KPIs, and AI-powered business insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(['monthly','weekly'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${period===p ? 'bg-brand-600 text-white' : 'text-dark-300 hover:text-white'}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => exportCSV(monthlyRevenue as unknown as Record<string,unknown>[], 'craftpack-revenue')}
            className="btn-secondary text-xs px-3 py-2 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Monthly Revenue"   value={fmtETB(kpis.cur.revenue)}  trend={`${kpis.revTrend}%`}  up={parseFloat(kpis.revTrend)>0}  icon={DollarSign}   accent="#10b981" />
        <KpiCard label="Net Profit"        value={fmtETB(kpis.cur.profit)}   trend={`${kpis.profTrend}%`} up={parseFloat(kpis.profTrend)>0} icon={TrendingUp}   accent="#22d3ee" sub={`${kpis.margin}% margin`} />
        <KpiCard label="Orders This Month" value={String(kpis.cur.orders)}   trend={`${kpis.ordTrend}%`}  up={parseFloat(kpis.ordTrend)>0}  icon={ShoppingBag}  accent="#f59e0b" />
        <KpiCard label="Active Clients"    value="127"                        trend="+8.2%"                up                                icon={Users}        accent="#8b5cf6" sub="vs last month" />
      </div>

      {/* Revenue & Profit Chart */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-white text-sm">Revenue vs Expenses vs Profit</h2>
          <button onClick={() => exportCSV(chartData as unknown as Record<string,unknown>[], `craftpack-${period}`)}
            className="text-xs text-dark-400 hover:text-white transition-colors flex items-center gap-1">
            <Download className="w-3 h-3" /> CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top:4, right:4, bottom:0, left:0 }}>
            <defs>
              <linearGradient id="gRev"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              <linearGradient id="gExp"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
              <linearGradient id="gProf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.25}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey={period==='monthly'?'month':'day'} stroke="#475569" tick={{ fontSize:11, fill:'#64748b' }} />
            <YAxis stroke="#475569" tick={{ fontSize:10, fill:'#64748b' }} tickFormatter={v => fmt(v)} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize:11, color:'#94a3b8' }} />
            <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#10b981" fill="url(#gRev)"  strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#gExp)"  strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="profit"   name="Profit"   stroke="#22d3ee" fill="url(#gProf)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Category Pie + Weekly Orders bar + Top Products */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Category breakdown */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-white text-sm">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {categoryPie.map((c, i) => <Cell key={i} fill={c.color} stroke="none" />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} contentStyle={{ background:'#090f1f', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {categoryPie.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:c.color }} />
                  <span className="text-dark-300">{c.name}</span>
                </div>
                <span className="font-medium text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Orders bar */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-white text-sm">Orders by Day (This Week)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyOrders} margin={{ top:4, right:4, bottom:0, left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize:11, fill:'#64748b' }} />
              <YAxis stroke="#475569" tick={{ fontSize:10, fill:'#64748b' }} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/3">
              <div className="text-xs text-dark-400">Best Day</div>
              <div className="font-bold text-white text-sm mt-0.5">Friday (22 orders)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/3">
              <div className="text-xs text-dark-400">Week Total</div>
              <div className="font-bold text-white text-sm mt-0.5">90 orders</div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-white text-sm">Top Products (May)</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-lg bg-brand-900/60 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-dark-200 truncate">{p.name}</p>
                    <p className="text-xs text-dark-500">{p.sales.toLocaleString()} units</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-white">{fmtETB(p.revenue)}</div>
                  <div className="text-xs text-brand-400 flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />{p.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="font-display font-semibold text-white text-sm">AI Business Insights</h2>
          <span className="badge-warning text-xs ml-auto">AI Generated</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {aiInsights.map((ins, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5 flex gap-3">
              <ins.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${ins.color}`} />
              <p className="text-sm text-dark-300 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-dark-500">AI insights are based on your recorded transaction data and historical trends.</p>
      </div>
    </div>
  );
}
