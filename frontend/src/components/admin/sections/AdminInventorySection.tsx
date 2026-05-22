'use client';

import { useState } from 'react';
import { Database, AlertTriangle, CheckCircle, Package } from 'lucide-react';

interface StockItem { id: string; product: string; category: string; stock: number; minStock: number; unit: string; lastUpdated: string; }

const SEED: StockItem[] = [
  { id:'s1', product:'Kraft Paper Bag – Small',  category:'paper_bags',     stock:12500, minStock:2000, unit:'pcs',   lastUpdated:'2026-05-20' },
  { id:'s2', product:'Kraft Paper Bag – Large',  category:'paper_bags',     stock:8200,  minStock:1500, unit:'pcs',   lastUpdated:'2026-05-20' },
  { id:'s3', product:'Luxury Ribbon Bag',        category:'luxury_bags',    stock:420,   minStock:200,  unit:'pcs',   lastUpdated:'2026-05-18' },
  { id:'s4', product:'Food Kraft Bag',           category:'food_packaging', stock:25000, minStock:5000, unit:'pcs',   lastUpdated:'2026-05-21' },
  { id:'s5', product:'Eco Jute-Style Bag',       category:'eco_friendly',   stock:1850,  minStock:500,  unit:'pcs',   lastUpdated:'2026-05-19' },
  { id:'s6', product:'Custom Printed Tote',      category:'custom_printed', stock:0,     minStock:300,  unit:'pcs',   lastUpdated:'2026-05-15' },
  { id:'s7', product:'Shopping Bag – Medium',    category:'shopping_bags',  stock:3100,  minStock:1000, unit:'pcs',   lastUpdated:'2026-05-20' },
  { id:'s8', product:'Cake & Pastry Box',        category:'food_packaging', stock:180,   minStock:200,  unit:'pcs',   lastUpdated:'2026-05-14' },
  { id:'s9', product:'Kraft Paper (Roll)',       category:'raw_material',   stock:42,    minStock:20,   unit:'rolls', lastUpdated:'2026-05-21' },
  { id:'s10',product:'Art Paper (Roll)',         category:'raw_material',   stock:8,     minStock:15,   unit:'rolls', lastUpdated:'2026-05-21' },
];

export default function AdminInventorySection() {
  const [items, setItems] = useState<StockItem[]>(SEED);

  const lowStock   = items.filter(i => i.stock <= i.minStock);
  const outOfStock = items.filter(i => i.stock === 0);

  function updateStock(id: string, delta: number) {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, stock: Math.max(0, i.stock + delta), lastUpdated: new Date().toISOString().slice(0,10) }
      : i
    ));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2"><Database className="w-6 h-6 text-brand-400" /> Inventory</h1>
        <p className="page-description">Monitor stock levels across all products and raw materials.</p>
      </div>

      {/* Alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="space-y-2">
          {outOfStock.map(i => (
            <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-300"><strong>{i.product}</strong> is out of stock!</span>
            </div>
          ))}
          {lowStock.filter(i => i.stock > 0).map(i => (
            <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-amber-300"><strong>{i.product}</strong> is running low ({i.stock} {i.unit} remaining).</span>
            </div>
          ))}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[660px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="table-header text-left px-5 py-3">Product</th>
              <th className="table-header text-right px-5 py-3">Stock</th>
              <th className="table-header text-right px-5 py-3">Min. Stock</th>
              <th className="table-header text-center px-5 py-3">Status</th>
              <th className="table-header text-center px-5 py-3">Adjust</th>
              <th className="table-header text-left px-5 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map(i => {
              const isOut  = i.stock === 0;
              const isLow  = !isOut && i.stock <= i.minStock;
              const isOk   = !isOut && !isLow;
              return (
                <tr key={i.id} className="hover:bg-white/3 transition-colors">
                  <td className="table-cell px-5">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-dark-500 flex-shrink-0" />
                      <span className="font-medium text-white">{i.product}</span>
                    </div>
                  </td>
                  <td className={`table-cell px-5 text-right font-bold ${isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
                    {i.stock.toLocaleString()} <span className="font-normal text-dark-500 text-xs">{i.unit}</span>
                  </td>
                  <td className="table-cell px-5 text-right text-dark-400">{i.minStock.toLocaleString()}</td>
                  <td className="table-cell px-5 text-center">
                    {isOut  && <span className="badge-danger">Out of Stock</span>}
                    {isLow  && <span className="badge-warning">Low Stock</span>}
                    {isOk   && <span className="badge-success">In Stock</span>}
                  </td>
                  <td className="table-cell px-5">
                    <div className="flex items-center gap-1 justify-center">
                      <button onClick={() => updateStock(i.id, -100)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-dark-300 flex items-center justify-center text-sm font-bold transition-colors">−</button>
                      <button onClick={() => updateStock(i.id, +500)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-600/10 hover:text-brand-400 text-dark-300 flex items-center justify-center text-sm font-bold transition-colors">+</button>
                    </div>
                  </td>
                  <td className="table-cell px-5 text-dark-500 text-xs">{i.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
