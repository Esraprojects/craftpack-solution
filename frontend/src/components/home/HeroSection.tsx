'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Zap, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const FloatingScene = dynamic(() => import('@/components/3d/FloatingScene'), {
  ssr: false,
  loading: () => null,
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

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted ? true : resolvedTheme === 'dark';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Full-screen 3D background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {mounted && <FloatingScene isDark={isDark} />}
      </div>

      {/* ── Gradient overlay for readability ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 80% at 40% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
            : 'radial-gradient(ellipse 70% 80% at 40% 50%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 60%, transparent 100%)',
        }}
      />
      {/* Edge vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
            : 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(255,255,255,0.3) 100%)',
        }}
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-2xl space-y-8"
        >
          {/* Badges */}
          <motion.div variants={item} className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                           bg-white/60 border border-zinc-200 text-zinc-600 backdrop-blur-sm
                           dark:bg-white/5 dark:border-white/10 dark:text-zinc-300"
              >
                <b.icon className="w-3 h-3" />
                {b.label}
              </div>
            ))}
          </motion.div>

          {/* Eyebrow */}
          <motion.div variants={item}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4
                            text-zinc-500 dark:text-zinc-400">
              <div className="w-8 h-px bg-zinc-400 dark:bg-zinc-500" />
              Ethiopia's #1 Packaging Manufacturer
            </div>

            <h1 className="font-display font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
              Premium
              <span className="block gradient-text">Paper Bags</span>
              <span className="block">&amp; Packaging</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p variants={item}
            className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-xl">
            Crafting world-class, eco-conscious packaging for Ethiopia's leading hotels, cafes,
            supermarkets, and enterprises. Custom branding to bulk manufacturing — delivered at scale.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link href="/quote" className="btn-primary text-base px-8 py-4 group">
              Get Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products" className="btn-secondary text-base px-8 py-4">
              Explore Products
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6
                       border-t border-zinc-200 dark:border-white/5"
          >
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="font-display font-bold text-2xl text-zinc-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div variants={item} className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['H','S','R','C','M'].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${[0,45,120,200,270][i]}, 0%, ${isDark ? 55 : 40}%)` }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-zinc-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Trusted by 500+ businesses</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-zinc-300 dark:border-white/20 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-zinc-700 dark:bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
