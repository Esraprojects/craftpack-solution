'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit3, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';

interface Post {
  id: string; title: string; category: string; author: string;
  summary: string; body: string; published: boolean; publishedAt: string;
}

const CATEGORIES = ['Sustainability','Industry Trends','How-To','Client Stories','Company News'];

const SEED: Post[] = [
  { id:'b1', title:'Why FSC-Certified Paper Matters for Ethiopian Businesses', category:'Sustainability', author:'Craftpack Team', summary:'Choosing FSC-certified packaging isn\'t just good for the planet — it\'s good for business.', body:'', published:true, publishedAt:'2026-05-10' },
  { id:'b2', title:'5 Packaging Trends Reshaping Retail in 2026', category:'Industry Trends', author:'Craftpack Team', summary:'From minimalist kraft to interactive QR designs, packaging is evolving fast.', body:'', published:true, publishedAt:'2026-05-03' },
  { id:'b3', title:'How to Choose the Right Paper Weight for Your Bags', category:'How-To', author:'Craftpack Team', summary:'80gsm vs 120gsm vs 300gsm — what\'s the right choice for your product?', body:'', published:true, publishedAt:'2026-04-25' },
  { id:'b4', title:'Case Study: Kaldi\'s Coffee Rebrand', category:'Client Stories', author:'Craftpack Team', summary:'How a new bag design boosted Kaldi\'s in-store brand perception by 40%.', body:'', published:false, publishedAt:'' },
];

const EMPTY = { title:'', category:CATEGORIES[0], author:'Craftpack Team', summary:'', body:'', published:false, publishedAt:'' };

function PostModal({ initial, onSave, onClose }: { initial: Post | null; onSave: (p: Omit<Post,'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY });
  const f = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card bg-dark-900 border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">{initial ? 'Edit Post' : 'New Blog Post'}</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="label">Title</label>
            <input value={form.title} onChange={e => f('title', e.target.value)} className="input-field" placeholder="Blog post title" />
          </div>
          <div className="space-y-1">
            <label className="label">Category</label>
            <select value={form.category} onChange={e => f('category', e.target.value)} className="select-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="label">Author</label>
            <input value={form.author} onChange={e => f('author', e.target.value)} className="input-field" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="label">Summary</label>
            <textarea rows={2} value={form.summary} onChange={e => f('summary', e.target.value)} className="input-field resize-none" placeholder="Short summary for previews…" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="label">Body (Markdown)</label>
            <textarea rows={6} value={form.body} onChange={e => f('body', e.target.value)} className="input-field resize-none font-mono text-xs" placeholder="Write your post content here…" />
          </div>
        </div>
        <button onClick={() => f('published', !form.published)}
          className={`flex items-center gap-2 text-sm font-medium ${form.published ? 'text-brand-400' : 'text-dark-400'}`}>
          <div className={`w-10 h-5 rounded-full transition-colors relative ${form.published ? 'bg-brand-600' : 'bg-white/10'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          {form.published ? 'Published' : 'Draft'}
        </button>
        <div className="flex gap-3 pt-2">
          <button onClick={() => onSave(form as Omit<Post,'id'>)} className="btn-primary flex-1">
            <Save className="w-4 h-4" /> {initial ? 'Save Changes' : 'Publish Post'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminBlogSection() {
  const [posts,      setPosts]      = useState<Post[]>(SEED);
  const [modal,      setModal]      = useState<'add' | Post | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  function handleSave(data: Omit<Post,'id'>) {
    if (modal === 'add') {
      setPosts(prev => [...prev, { ...data, id:`b${Date.now()}`, publishedAt: data.published ? new Date().toISOString().slice(0,10) : '' }]);
    } else if (modal && typeof modal === 'object') {
      setPosts(prev => prev.map(p => p.id === modal.id ? { ...p, ...data } : p));
    }
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><BookOpen className="w-6 h-6 text-brand-400" /> Blog Posts</h1>
          <p className="page-description">{posts.filter(p=>p.published).length} published · {posts.filter(p=>!p.published).length} drafts</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-brand">{p.category}</span>
                {p.published ? <span className="badge-success">Published</span> : <span className="badge-neutral">Draft</span>}
              </div>
              <h3 className="font-medium text-white leading-snug">{p.title}</h3>
              <p className="text-sm text-dark-400 mt-1 line-clamp-1">{p.summary}</p>
              {p.publishedAt && <p className="text-xs text-dark-500 mt-1">{p.publishedAt} · {p.author}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setPosts(prev => prev.map(x => x.id===p.id ? {...x,published:!x.published} : x))}
                className="btn-ghost p-2" title={p.published ? 'Unpublish' : 'Publish'}>
                {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => setModal(p)} className="btn-ghost p-2"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => setConfirmDel(p.id)} className="btn-ghost p-2 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal !== null && <PostModal initial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {confirmDel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="card bg-dark-900 border-white/10 p-6 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-white font-display">Delete Post?</h3>
              <p className="text-dark-300 text-sm">This will permanently delete the blog post.</p>
              <div className="flex gap-3">
                <button className="btn-danger flex-1" onClick={() => { setPosts(p => p.filter(x => x.id !== confirmDel)); setConfirmDel(null); }}>Delete</button>
                <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
