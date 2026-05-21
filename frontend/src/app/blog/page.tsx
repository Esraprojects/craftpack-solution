import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';

export const metadata: Metadata = { title: 'Blog — Craftpack Solution', description: 'Packaging tips, industry insights, and sustainability news from Craftpack Solution.' };

const posts = [
  { title: 'Why Kraft Paper Bags Are the Future of Retail Packaging in Ethiopia', date: 'May 10, 2026', author: 'Craftpack Team', readTime: '5 min', category: 'Industry', excerpt: 'As environmental consciousness grows among Ethiopian consumers, kraft paper bags are replacing plastic in leading retail chains. Here is why the shift is accelerating.' },
  { title: 'How to Choose the Right Bag Size for Your Business', date: 'Apr 28, 2026', author: 'Design Team', readTime: '4 min', category: 'Guide', excerpt: 'Choosing the wrong bag size costs money and disappoints customers. Our sizing guide helps you pick the optimal dimensions for retail, food, and gift packaging.' },
  { title: 'The ROI of Premium Packaging: Do Luxury Bags Drive More Sales?', date: 'Apr 15, 2026', author: 'Sales Team', readTime: '7 min', category: 'Business', excerpt: 'Studies show that 72% of customers say packaging design influences their purchasing decision. We break down how investing in premium bags pays off.' },
  { title: 'FSC Certification Explained: What It Means for Your Brand', date: 'Mar 30, 2026', author: 'Sustainability', readTime: '6 min', category: 'Sustainability', excerpt: 'FSC certification is more than a logo — it is a promise to your customers that your packaging does not contribute to deforestation. Here is what it means for your business.' },
  { title: "Craftpack's New Compostable Bag Line: Zero Waste Packaging Arrives in Ethiopia", date: 'Mar 12, 2026', author: 'Craftpack Team', readTime: '3 min', category: 'News', excerpt: 'We are proud to announce our fully compostable packaging line, the first of its kind available at scale in Ethiopia, made from plant-based materials.' },
  { title: 'Custom Printing 101: Choosing Colors, Finishes, and Techniques', date: 'Feb 20, 2026', author: 'Design Team', readTime: '8 min', category: 'Guide', excerpt: 'From CMYK to Pantone, matte to gloss, embossing to foil stamping — your complete guide to custom packaging print options and when to use each.' },
];

const categoryColors: Record<string, string> = {
  Industry:      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  Guide:         'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  Business:      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  Sustainability:'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  News:          'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">Insights</p>
          <h1 className="section-title mb-6">The Craftpack <span className="gradient-text">Blog</span></h1>
          <p className="section-subtitle">Packaging tips, sustainability news, and industry insights to help your business grow.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <article key={post.title} className="card p-6 card-hover flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? ''}`}>{post.category}</span>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />{post.readTime} read
                </div>
              </div>
              <h2 className="font-display font-bold text-zinc-900 dark:text-white leading-snug">{post.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <User className="w-3.5 h-3.5" />{post.author} · {post.date}
                </div>
                <Link href="/contact" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">Read <ArrowRight className="w-3 h-3" /></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">Want us to write about a specific topic?</p>
          <Link href="/contact" className="btn-secondary gap-2">Suggest a Topic <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}
