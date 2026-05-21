import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Users, Package, Award, Leaf, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Craftpack Solution',
  description: "Ethiopia's leading paper bag and packaging manufacturer based in Addis Ababa.",
};

const stats = [
  { value: '15+',   label: 'Years in Business' },
  { value: '500+',  label: 'Enterprise Clients' },
  { value: '10M+',  label: 'Bags Produced' },
  { value: '99.2%', label: 'Client Satisfaction' },
];

const values = [
  { icon: Leaf,    title: 'Sustainability',  desc: 'We source FSC-certified and recycled materials, minimising environmental impact at every production step.' },
  { icon: Award,   title: 'Quality First',   desc: 'ISO 9001:2015 certified processes ensure every bag meets the highest standards before leaving our facility.' },
  { icon: Users,   title: 'Client-Centric',  desc: 'From SMEs to multinationals, we tailor every order to your brand, budget, and timeline.' },
  { icon: Package, title: 'Local Pride',     desc: 'Proudly Ethiopian — manufacturing locally, creating jobs, and contributing to the national economy.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">Our Story</p>
          <h1 className="section-title mb-6">
            {"Ethiopia's Trusted "}
            <span className="gradient-text">Packaging Partner</span>
          </h1>
          <p className="section-subtitle">
            Founded in Addis Ababa, Craftpack Solution has spent over 15 years crafting premium,
            eco-conscious packaging for the continent's most respected brands — from boutique hotels
            to national supermarket chains.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="card p-6 text-center">
              <div className="font-display font-bold text-4xl text-zinc-900 dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
              To empower Ethiopian businesses with world-class packaging that elevates brand identity,
              protects products, and demonstrates a commitment to environmental responsibility.
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every bag we produce carries a piece of your brand story. That is why we invest in
              state-of-the-art printing technology, sustainable sourcing, and a skilled workforce —
              to deliver packaging that makes a lasting impression.
            </p>
            <ul className="space-y-3">
              {['ISO 9001:2015 Quality Certified','FSC-Certified Sustainable Materials','In-house design & print team','Delivery across Ethiopia & exports'].map(item => (
                <li key={item} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8 space-y-5">
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Find Us</h3>
            {[
              { icon: MapPin, text: 'Gofa Camp & Gurdshola, Addis Ababa, Ethiopia' },
              { icon: Phone,  text: '0901 236 509 / 0957 117 787 / 0910 628 159' },
              { icon: Mail,   text: 'info@craftpacksolution.com' },
              { icon: Clock,  text: 'Mon–Sat: 8:00 AM – 6:00 PM EAT' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-600 dark:text-zinc-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="card p-6 card-hover space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-12 text-center space-y-6">
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">Ready to Work Together?</h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
            Let us create packaging that makes your brand unforgettable. Get a free custom quote today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary gap-2">Get Free Quote <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
