import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, TreePine, Droplets, Award, CheckCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Sustainability — Craftpack Solution', description: 'Our commitment to eco-friendly, sustainable packaging manufacturing in Ethiopia.' };

const initiatives = [
  { icon: Recycle,   title: 'Recycled Materials',      desc: 'Over 60% of our raw materials are sourced from post-consumer recycled content, significantly reducing virgin resource consumption.' },
  { icon: TreePine,  title: 'FSC Certification',       desc: 'All virgin paper we use is sourced from FSC-certified forests, ensuring responsible forestry and biodiversity protection.' },
  { icon: Droplets,  title: 'Water Conservation',      desc: 'Our production facility uses closed-loop water recycling, reducing freshwater consumption by 40% compared to industry standards.' },
  { icon: Leaf,      title: 'Soy-Based Inks',          desc: 'We exclusively use water-based and soy-based inks that are 100% biodegradable and non-toxic, safe for food packaging applications.' },
  { icon: Award,     title: 'ISO 14001 Certified',     desc: 'Our environmental management system is ISO 14001:2015 certified, demonstrating systematic commitment to minimising environmental impact.' },
  { icon: TreePine,  title: 'Carbon Offset Program',   desc: 'We partner with local reforestation programs in Ethiopia, offsetting 100% of our production carbon footprint annually.' },
];

const ecoProducts = [
  { name: 'Eco Recycled Paper Bag',  slug: 'eco-recycled-paper-bag',  feat: ['100% recycled content','Biodegradable in 90 days','FSC certified'] },
  { name: 'Compostable Kraft Bag',   slug: 'premium-kraft-shopping-bag', feat: ['Compostable certified','Natural dyes only','Zero plastic'] },
  { name: 'Unbleached Natural Bag',  slug: 'food-grade-paper-bag',    feat: ['No bleaching chemicals','Soy ink printing','Minimal processing'] },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">Sustainability</p>
          <h1 className="section-title mb-6">Packaging with a <span className="gradient-text">Purpose</span></h1>
          <p className="section-subtitle">We believe beautiful packaging and environmental responsibility are not mutually exclusive. Every choice we make considers the impact on our planet.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map(init => (
            <div key={init.title} className="card p-6 card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <init.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">{init.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{init.desc}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white text-center mb-10">Our Eco Product Line</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ecoProducts.map(p => (
              <div key={p.name} className="card p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">{p.name}</h3>
                <ul className="space-y-2">{p.feat.map(f => <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}</li>)}</ul>
                <Link href={`/products/${p.slug}`} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">View Product <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-12 text-center space-y-6 border-emerald-200 dark:border-emerald-900/30">
          <Leaf className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">Make Your Brand Green</h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">Switch to eco-friendly packaging without compromising on quality or appearance. Our green range starts at the same price as standard packaging.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products?category=eco_friendly" className="btn-primary gap-2">Explore Eco Range <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/quote" className="btn-secondary">Get Eco Quote</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
