'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Shield, Leaf, Zap } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  ),
});

const stats = [
  { value: '500+',  label: 'Enterprise Clients' },
  { value: '10M+',  label: 'Bags Produced' },
  { value: '15+',   label: 'Years Experience' },
  { value: '99.2%', label: 'Client Satisfaction' },
];

const badges = [
  { icon: Shield, label: 'ISO 9001 Certified' },
  { icon: Leaf,   label: 'FSC Certified' },
  { icon: Zap,    label: '24hr Quote Turnaround' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-950">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-dark-mesh" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-900/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-gold-900/10 via-transparent to-transparent" />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">

          {/* Left — Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 lg:pr-8"
          >
            {/* Badge row */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {badges.map(b => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-dark-300">
                  <b.icon className="w-3 h-3 text-brand-400" />
                  {b.label}
                </div>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
                <div className="w-8 h-px bg-brand-400" />
                Ethiopia's #1 Packaging Manufacturer
              </div>
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white">
                Premium
                <span className="block gradient-text">Paper Bags</span>
                <span className="block text-white">& Packaging</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-lg text-dark-300 leading-relaxed max-w-xl">
              Crafting world-class, eco-conscious packaging solutions for Ethiopia's leading hotels,
              cafes, supermarkets, and enterprises. From custom branding to bulk manufacturing —
              we deliver excellence at scale.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link href="/quote" className="btn-primary text-base px-8 py-4 group">
                Get Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/products" className="btn-secondary text-base px-8 py-4 group">
                Explore Products
              </Link>
              <button className="flex items-center gap-2.5 text-sm text-dark-300 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-brand-600/20 group-hover:border-brand-500/30 transition-all">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Watch our story
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/5">
              {stats.map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-xs text-dark-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Trusted by */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-dark-950 bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${[199, 38, 271, 160, 340][i]}, 70%, 50%)`,
                    }}
                  >
                    {['H', 'S', 'R', 'C', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-xs text-dark-400">Trusted by 500+ businesses</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative h-[550px] lg:h-[700px]"
          >
            {/* Glow effect behind scene */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-900/20 via-transparent to-gold-900/10" />

            {/* 3D Canvas */}
            <div className="w-full h-full">
              <HeroScene />
            </div>

            {/* Floating info cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute left-4 bottom-16 glass rounded-2xl p-4 shadow-2xl max-w-[180px]"
            >
              <div className="text-xs text-dark-400 mb-1">Latest Order</div>
              <div className="text-sm font-semibold text-white">Hyatt Regency</div>
              <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                In Production
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute right-4 top-20 glass rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-xs text-dark-400 mb-1">This Month</div>
              <div className="text-xl font-bold font-display text-white">847K</div>
              <div className="text-xs text-dark-400">bags produced</div>
              <div className="text-xs text-emerald-400 mt-1">↑ 23% from last month</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-dark-500 uppercase tracking-widest">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-brand-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
