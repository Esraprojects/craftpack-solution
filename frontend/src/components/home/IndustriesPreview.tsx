'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Hotel, Coffee, ShoppingBag, Briefcase, Utensils, Plane, Shirt, Building2 } from 'lucide-react';

const industries = [
  { icon: Hotel,      name: 'Hotels & Resorts',   count: '80+',  color: 'from-amber-500 to-orange-600',  desc: 'Premium in-room & retail bags for luxury hospitality' },
  { icon: Coffee,     name: 'Cafes & Coffee Shops',count: '120+', color: 'from-brand-500 to-blue-600',   desc: 'Branded takeaway & loyalty packaging solutions' },
  { icon: ShoppingBag,name: 'Retail & Fashion',    count: '200+', color: 'from-pink-500 to-rose-600',    desc: 'Eye-catching retail packaging that sells more' },
  { icon: Briefcase,  name: 'Corporate Gifting',   count: '50+',  color: 'from-violet-500 to-purple-600', desc: 'Impressive gift packaging for corporate events' },
  { icon: Utensils,   name: 'Food & Bakeries',     count: '150+', color: 'from-emerald-500 to-green-600', desc: 'Food-safe hygienic packaging for edibles' },
  { icon: Plane,      name: 'Aviation & Travel',   count: '10+',  color: 'from-sky-500 to-cyan-600',     desc: 'Duty-free & lounge retail premium packaging' },
  { icon: Shirt,      name: 'Fashion & Apparel',   count: '90+',  color: 'from-fuchsia-500 to-pink-600', desc: 'Luxury bags for clothing boutiques & brands' },
  { icon: Building2,  name: 'Supermarkets',         count: '30+',  color: 'from-gold-500 to-yellow-600', desc: 'High-volume, durable bags for grocery retail' },
];

export default function IndustriesPreview() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-dark-950" />
      <div className="absolute inset-0 bg-noise opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
              <div className="w-8 h-px bg-brand-400" />
              Industries We Serve
            </div>
            <h2 className="section-title max-w-lg">
              Packaging for Every <span className="gradient-text">Industry</span>
            </h2>
          </div>
          <Link href="/industries" className="btn-secondary flex-shrink-0">
            All Industries <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card card-hover p-5 group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <industry.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-display font-bold text-2xl text-white mb-0.5">{industry.count}</div>
              <div className="font-semibold text-sm text-white mb-2">{industry.name}</div>
              <p className="text-xs text-dark-400 leading-relaxed">{industry.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
