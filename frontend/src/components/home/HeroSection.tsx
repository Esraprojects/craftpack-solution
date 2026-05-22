'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Leaf, Zap, Star, TrendingUp } from 'lucide-react';
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
  { icon: Shield, label: 'ISO 9001 Certified',     color: 'brand' },
  { icon: Leaf,   label: 'FSC Certified',           color: 'brand' },
  { icon: Zap,    label: '24hr Quote Turnaround',   color: 'accent' },
];

const container = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
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

      {/* ── Dark overlay for readability ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 90% at 35% 50%, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.45) 60%, transparent 100%)'
            : 'radial-gradient(ellipse 80% 90% at 35% 50%, rgba(250,248,244,0.85) 0%, rgba(250,248,244,0.55) 65%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.30) 50%, transparent 100%)'
            : 'linear-gradient(to right, rgba(250,248,244,0.90) 0%, rgba(250,248,244,0.40) 55%, transparent 100%)',
        }}
      />
      {/* Bottom gradient blend into page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to top, #020617, transparent)'
            : 'linear-gradient(to top, #faf8f4, transparent)',
        }}
      />

      {/* ── Ambient glow blobs ── */}
      {isDark && (
        <>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 z-[1] pointer-events-none opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute top-1/2 left-8 w-64 h-64 z-[1] pointer-events-none opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #22d3ee, transparent 70%)', filter: 'blur(50px)' }} />
        </>
      )}

      {/* ── Hero content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-[600px] space-y-7"
        >
          {/* Eyebrow pill */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest
                            border border-brand-500/30 bg-brand-500/10 text-brand-400 backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              Ethiopia&apos;s #1 Packaging Manufacturer
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={item}>
            <h1 className="font-display font-bold leading-[1.04] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 6.5vw, 5.2rem)' }}>
              <span className={isDark ? 'text-white' : 'text-zinc-900'}>Premium</span>
              <span className="block gradient-text-hero">Paper Bags</span>
              <span className={isDark ? 'text-white/90' : 'text-zinc-800'}>&amp; Packaging</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p variants={item}
            className="text-lg leading-relaxed max-w-lg"
            style={{ color: isDark ? 'rgba(203,213,225,0.9)' : '#475569' }}>
            Crafting world-class, eco-conscious packaging for Ethiopia&apos;s leading hotels, cafes,
            supermarkets, and enterprises. Custom branding to bulk manufacturing — delivered at scale.
          </motion.p>

          {/* Badges */}
          <motion.div variants={item} className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div
                key={b.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm
                  ${b.color === 'accent'
                    ? 'bg-accent-500/10 border border-accent-500/25 text-accent-300 dark:text-accent-300'
                    : 'bg-brand-500/10 border border-brand-500/25 text-brand-300 dark:text-brand-300'
                  }
                  text-brand-700 dark:text-brand-300 border-brand-200/60 dark:border-brand-700/30`}
              >
                <b.icon className="w-3 h-3" />
                {b.label}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-1">
            <Link href="/quote" className="btn-primary text-base px-8 py-4 group">
              Get Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products" className="btn-secondary text-base px-8 py-4">
              Explore Products
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}
          >
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="font-display font-bold text-2xl"
                  style={{ color: isDark ? '#fff' : '#0f172a' }}>{stat.value}</div>
                <div className="text-xs mt-0.5"
                  style={{ color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div variants={item} className="flex items-center gap-4 pt-1">
            <div className="flex -space-x-2">
              {['#10b981','#22d3ee','#f59e0b','#8b5cf6','#ec4899'].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: bg,
                    borderColor: isDark ? '#020617' : '#faf8f4',
                  }}
                >
                  {['H','S','R','C','M'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b' }}>
                Trusted by 500+ businesses across Ethiopia
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: isDark ? 'rgba(100,116,139,0.8)' : '#94a3b8' }}>
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border flex items-start justify-center p-1"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)' }}>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full"
            style={{ background: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
