'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Leaf, Award, Clock, Truck, Headphones, Recycle, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'ISO 9001 Certified',
    description: 'Our quality management systems meet international standards, ensuring consistent excellence in every batch.',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    icon: Leaf,
    title: 'FSC Certified Materials',
    description: 'All our paper materials are sourced from responsibly managed forests, supporting environmental conservation.',
    gradient: 'from-emerald-500 to-green-700',
  },
  {
    icon: Clock,
    title: '24-Hour Quotes',
    description: 'Get detailed pricing within 24 hours of your inquiry. No delays, no surprises — just fast, accurate quotes.',
    gradient: 'from-gold-500 to-amber-700',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every product undergoes rigorous QC checks. 99.8% defect-free delivery record over 15 years of operation.',
    gradient: 'from-purple-500 to-violet-700',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Reliable delivery across Ethiopia and international export capabilities to East Africa and beyond.',
    gradient: 'from-sky-500 to-blue-700',
  },
  {
    icon: Recycle,
    title: 'Eco-Conscious',
    description: 'Committed to zero-waste manufacturing. 40% of our energy comes from renewable sources.',
    gradient: 'from-teal-500 to-cyan-700',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Standard orders ready in 7–14 days. Rush production available for urgent requirements.',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Dedicated account manager for every corporate client. Available Monday–Saturday, 8 AM–8 PM.',
    gradient: 'from-pink-500 to-rose-700',
  },
];

const clients = [
  'Hyatt Regency', 'Hilton Hotels', 'Safeway', 'Friendship Supermarket',
  'Kaldi\'s Coffee', 'Tomoca Coffee', 'Ethiopian Airlines', 'Jumia Ethiopia',
];

export default function TrustSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
      <div className="absolute inset-0 bg-noise opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Client Logos Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <p className="text-center text-xs font-semibold text-dark-500 uppercase tracking-widest mb-8">
            Trusted by Ethiopia's leading brands
          </p>
          <div className="relative flex overflow-hidden">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...clients, ...clients].map((name, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-6 py-3 rounded-xl bg-white/3 border border-white/5 text-dark-400 text-sm font-medium hover:text-white hover:border-white/10 transition-all duration-200"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
              <div className="w-8 h-px bg-brand-400" />
              Why Choose Us
              <div className="w-8 h-px bg-brand-400" />
            </div>
            <h2 className="section-title">
              Built on <span className="gradient-text">Trust & Excellence</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              15 years of manufacturing experience, international certifications, and a relentless
              commitment to quality and sustainability.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card card-hover p-6 space-y-4 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-gradient-to-r from-brand-900/20 via-dark-800/40 to-gold-900/20 border border-white/5"
        >
          {[
            { value: '500+',   label: 'Enterprise Clients',     sub: 'Across Ethiopia' },
            { value: '10M+',   label: 'Bags Manufactured',      sub: 'Last 12 months' },
            { value: '99.8%',  label: 'On-Time Delivery',       sub: 'Industry-leading' },
            { value: 'ETB 0',  label: 'Hidden Fees',            sub: 'Transparent pricing always' },
          ].map(stat => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="font-display font-bold text-3xl md:text-4xl gradient-text">{stat.value}</div>
              <div className="font-medium text-white text-sm">{stat.label}</div>
              <div className="text-xs text-dark-500">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
