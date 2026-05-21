'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Palette, Factory, Package, Truck, ThumbsUp } from 'lucide-react';

const steps = [
  { icon: FileText, step: '01', title: 'Submit Inquiry',    color: '#0ea5e9', desc: 'Fill out our quote form with your requirements — quantity, size, material, and customization needs.' },
  { icon: Palette,  step: '02', title: 'Design & Proof',   color: '#f59e0b', desc: 'Our design team creates digital proofs. We iterate until you\'re 100% satisfied with the look.' },
  { icon: Factory,  step: '03', title: 'Production',       color: '#10b981', desc: 'Your order enters our ISO-certified production line with strict quality control at every stage.' },
  { icon: Package,  step: '04', title: 'Quality Check',    color: '#6366f1', desc: 'Every batch undergoes rigorous quality inspection. 99.8% pass-rate with zero compromises.' },
  { icon: Truck,    step: '05', title: 'Delivery',         color: '#ec4899', desc: 'Secure packaging and reliable delivery across Ethiopia and export-ready international shipments.' },
  { icon: ThumbsUp, step: '06', title: 'Your Satisfaction',color: '#f97316', desc: 'Ongoing support from your dedicated account manager. We ensure you\'re delighted every time.' },
];

export default function ProcessSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
            <div className="w-8 h-px bg-brand-400" />
            How It Works
            <div className="w-8 h-px bg-brand-400" />
          </div>
          <h2 className="section-title">
            From Idea to <span className="gradient-text">Delivery</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Our streamlined 6-step process ensures your packaging is perfect, on-brand, and delivered on time.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div className="relative z-10 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center text-xs font-bold text-dark-400">
                    {step.step}
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
