import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Coffee, Hotel, ShoppingCart, Utensils, Plane, Building2, Leaf, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve — Craftpack Solution',
  description: 'Craftpack Solution serves hotels, cafes, supermarkets, airlines, and more across Ethiopia.',
};

const industries = [
  { icon: Hotel,       title: 'Hospitality & Hotels',    desc: 'Luxury packaging matching your property brand — in-room gifts to restaurant takeaway.', clients: ['Hyatt Regency','Sheraton Addis','Radisson Blu','Hilton Addis'], products: ['Luxury gift bags','Branded totes','Amenity pouches'] },
  { icon: Coffee,      title: 'Cafes & Coffee Shops',    desc: "Eco-friendly and stylish bags for Ethiopia's thriving cafe culture. Custom printed with your logo.", clients: ["Kaldi's Coffee",'Tomoca Coffee','Yeshi Buna','Dashen Cafe'], products: ['Takeaway bags','Bean packaging','Bakery bags'] },
  { icon: ShoppingCart,title: 'Supermarkets & Retail',   desc: 'Bulk supply of durable branded shopping bags for major retail chains at competitive pricing.', clients: ['Safeway','Shoa Super','Friendship Market','Bambis'], products: ['Shopping bags','Checkout bags','Promo bags'] },
  { icon: Utensils,    title: 'Restaurants & Food',      desc: 'Food-safe, grease-resistant bags that keep food fresh and present your brand professionally.', clients: ['Pizza Hut ET','Yod Abyssinia','Habesha Restaurant','Local chains'], products: ['Food-grade bags','Takeaway boxes','Delivery bags'] },
  { icon: Plane,       title: 'Airlines & Travel',       desc: 'Lightweight premium packaging for in-flight amenities, duty-free retail, and traveller gifts.', clients: ['Ethiopian Airlines','Airport retailers','Duty-free operators'], products: ['Amenity bags','Duty-free bags','Gift pouches'] },
  { icon: Building2,   title: 'Corporate & Events',      desc: 'Branded bags for corporate events, product launches, conferences, and employee gifts.', clients: ['Banks','NGOs & Embassies','Gov agencies','Tech companies'], products: ['Event totes','Gift bags','Welcome kits'] },
  { icon: ShoppingBag, title: 'Fashion & Boutiques',     desc: "Luxury and mid-range fashion bags that reflect your brand's aesthetic.", clients: ['Fashion retailers','Jewellery stores','Shoe stores','Accessories'], products: ['Boutique bags','Rigid bags','Ribbon bags'] },
  { icon: Leaf,        title: 'Eco & Organic Brands',    desc: 'FSC-certified, 100% recycled, and compostable packaging for sustainability-focused brands.', clients: ['Organic stores','Farmers markets','Health food','Green NGOs'], products: ['Recycled bags','Compostable bags','Unbleached kraft'] },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">Industries</p>
          <h1 className="section-title mb-6">Packaging for Every <span className="gradient-text">Industry</span></h1>
          <p className="section-subtitle">From luxury hotels to bustling cafes, we supply premium packaging to Ethiopia's most respected businesses.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {industries.map(ind => (
            <div key={ind.title} className="card p-8 card-hover space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <ind.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">{ind.title}</h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{ind.desc}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Key Clients</p>
                <div className="flex flex-wrap gap-2">{ind.clients.map(c => <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">{c}</span>)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Popular Products</p>
                <div className="flex flex-wrap gap-2">{ind.products.map(p => <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">{p}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-12 text-center space-y-6">
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">{"Don't See Your Industry?"}</h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">We work with businesses of all types. Contact us to discuss your specific packaging needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary gap-2">Get a Quote <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/contact" className="btn-secondary">Talk to Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
