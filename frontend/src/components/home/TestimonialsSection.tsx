'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const testimonials = [
  {
    id: '1',
    name:    'Yohannes Tadesse',
    company: 'Hyatt Regency Addis Ababa',
    role:    'Procurement Manager',
    rating:  5,
    content: 'Craftpack Solution has been our packaging partner for 4 years. Their luxury bags perfectly represent our brand. The custom gold foil stamping on our gift bags is absolutely stunning, and delivery is always on time.',
    product: 'Luxury Matte Gift Bags',
    date:    '2024-11-15',
  },
  {
    id: '2',
    name:    'Mekdes Alemu',
    company: 'Kaldi\'s Coffee',
    role:    'Operations Director',
    rating:  5,
    content: 'We switched to Craftpack\'s eco-friendly bags and our customers love them. The quality is exceptional and the custom printing is crisp and vibrant. Highly recommend for any food business serious about sustainability.',
    product: 'Eco Food Packaging',
    date:    '2024-10-22',
  },
  {
    id: '3',
    name:    'Daniel Girma',
    company: 'Friendship Supermarket',
    role:    'Brand & Marketing Lead',
    rating:  5,
    content: 'When we rebranded, Craftpack was with us every step of the way. They helped us design bags that communicate our brand values perfectly. Our customers frequently comment on the quality of our packaging.',
    product: 'Custom Branded Bags',
    date:    '2024-09-10',
  },
  {
    id: '4',
    name:    'Rahel Bekele',
    company: 'Safeway Superstore',
    role:    'Supply Chain Manager',
    rating:  5,
    content: 'Bulk ordering from Craftpack is seamless. Their online portal makes ordering simple, and the bulk pricing is very competitive. We order 50,000+ bags monthly and the consistency in quality is remarkable.',
    product: 'Bulk Shopping Bags',
    date:    '2024-08-05',
  },
  {
    id: '5',
    name:    'Amanuel Kebede',
    company: 'Ethiopian Airlines Lounges',
    role:    'Hospitality Director',
    rating:  5,
    content: 'We needed premium packaging that represents Ethiopian Airlines\' prestige. Craftpack delivered beyond expectations. The duty-free shopping bags with our livery look absolutely first-class.',
    product: 'Premium Corporate Bags',
    date:    '2024-07-18',
  },
];

export default function TestimonialsSection() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(i => (i + 1) % testimonials.length);

  const current = testimonials[active];

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-brand-900/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-gold-900/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
            <div className="w-8 h-px bg-brand-400" />
            Client Stories
            <div className="w-8 h-px bg-brand-400" />
          </div>
          <h2 className="section-title">
            What Our Clients <span className="gradient-text">Say About Us</span>
          </h2>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Large Quote Block */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-white/5"
              >
                <Quote className="absolute top-6 left-8 w-10 h-10 text-brand-500/20" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed mb-8 italic">
                  "{current.content}"
                </blockquote>

                {/* Product Used */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-8">
                  Used: {current.product}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                    {getInitials(current.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{current.name}</div>
                    <div className="text-sm text-dark-400">{current.role} · {current.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? 'w-8 bg-brand-400' : 'w-2 bg-dark-600 hover:bg-dark-400'
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 hover:border-brand-500/30 hover:bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 hover:border-brand-500/30 hover:bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail previews */}
          <div className="hidden md:flex gap-4 mt-10 justify-center flex-wrap">
            {testimonials.map((t, i) => (
              <motion.button
                key={t.id}
                onClick={() => setActive(i)}
                whileHover={{ y: -3 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  i === active
                    ? 'bg-brand-600/20 border-brand-500/40 text-white'
                    : 'bg-dark-800/40 border-white/5 text-dark-400 hover:border-white/10'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `hsl(${i * 60}, 60%, 40%)` }}
                >
                  {getInitials(t.name)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium leading-none">{t.name.split(' ')[0]}</div>
                  <div className="text-2xs text-dark-500 mt-0.5">{t.company.split(' ').slice(0, 2).join(' ')}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
