'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, MessageSquare, PhoneCall } from 'lucide-react';

export default function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-dark-950 to-gold-900/20" />
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Ready to start your order?
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
              Let's Create Something
              <span className="block gradient-text">Extraordinary</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
              Join 500+ businesses that trust Craftpack Solution for their packaging needs.
              Get your free quote in 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-gold text-base px-10 py-4 group">
              Request Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/custom-order" className="btn-primary text-base px-10 py-4">
              Start Custom Order
            </Link>
            <a href="tel:+251911000000" className="btn-secondary text-base px-8 py-4 gap-2">
              <PhoneCall className="w-4 h-4" /> Call Us Now
            </a>
          </div>

          <p className="text-sm text-dark-500">
            No commitment required · Free design consultation · 24-hour response guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
