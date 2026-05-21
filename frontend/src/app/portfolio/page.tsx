import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

export const metadata: Metadata = { title: 'Portfolio — Craftpack Solution', description: 'See our packaging work for leading Ethiopian brands.' };

const projects = [
  { client: 'Hyatt Regency Ethiopia',    category: 'Hospitality', product: 'Luxury Gift Bags',          desc: '5,000 custom matte laminated bags with gold foil stamping for VIP guest amenities.', tags: ['Luxury','Foil Stamping','Matte'] },
  { client: "Kaldi's Coffee",            category: 'Cafe',        product: 'Branded Takeaway Bags',      desc: '50,000 eco kraft bags with 3-color logo print for daily takeaway service across all branches.', tags: ['Eco','Kraft','High Volume'] },
  { client: 'Safeway Supermarket',       category: 'Retail',      product: 'Shopping Bags',              desc: '200,000 reinforced shopping bags with vibrant 4-color branding for checkout counters.', tags: ['Bulk','4-Color','Reinforced'] },
  { client: 'Ethiopian Airlines',        category: 'Aviation',    product: 'Amenity Pouches',            desc: '20,000 premium fabric-feel pouches for business class in-flight amenity kits.', tags: ['Premium','Soft-touch','Custom size'] },
  { client: 'Friendship Supermarket',    category: 'Retail',      product: 'Promotional Bags',           desc: '80,000 festive-themed bags for holiday promotions and seasonal campaigns.', tags: ['Seasonal','Custom print','Festive'] },
  { client: 'Sheraton Addis',            category: 'Hospitality', product: 'F&B Packaging',              desc: '10,000 food-grade bags for the hotel\'s restaurants and room service operations.', tags: ['Food-safe','Hotel','Custom'] },
  { client: 'Yod Abyssinia Restaurant',  category: 'Restaurant',  product: 'Takeaway Packaging',         desc: '15,000 custom kraft bags carrying the restaurant\'s cultural identity and brand story.', tags: ['Kraft','Cultural design','Restaurant'] },
  { client: 'Corporate Client',          category: 'Corporate',   product: 'Event Gift Bags',            desc: '2,000 rigid luxury gift bags for a multinational company\'s annual gala event in Addis.', tags: ['Rigid','Luxury','Corporate event'] },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">Portfolio</p>
          <h1 className="section-title mb-6">Our Work, <span className="gradient-text">Their Brands</span></h1>
          <p className="section-subtitle">A selection of packaging projects we have delivered for leading Ethiopian and international brands.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div key={i} className="card p-8 card-hover space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{p.category}</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">{p.client}</h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{p.product}</p>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-2">{p.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{t}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="card p-12 text-center space-y-6">
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">Ready to Join Our Portfolio?</h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">Let us create packaging that tells your brand story. Get a free quote today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary gap-2">Start Your Project <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
