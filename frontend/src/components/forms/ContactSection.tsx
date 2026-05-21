'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2, MessageSquare, FileText, HandshakeIcon, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(20),
  type:    z.enum(['general', 'quote', 'support', 'partnership']),
});

type FormData = z.infer<typeof schema>;

const inquiryTypes = [
  { value: 'general',     label: 'General Inquiry',  icon: MessageSquare },
  { value: 'quote',       label: 'Request Quote',     icon: FileText },
  { value: 'support',     label: 'Order Support',     icon: Headphones },
  { value: 'partnership', label: 'Partnership',       icon: HandshakeIcon },
] as const;

const contactInfo = [
  { icon: MapPin, title: 'Visit Us',    lines: ['Bole Sub-city, Wereda 03', 'Addis Ababa, Ethiopia'] },
  { icon: Phone,  title: 'Call Us',     lines: ['+251 911 000 000', '+251 116 000 000'] },
  { icon: Mail,   title: 'Email Us',    lines: ['info@craftpacksolution.com', 'sales@craftpacksolution.com'] },
  { icon: Clock,  title: 'Working Hours', lines: ['Mon–Sat: 8:00 AM – 8:00 PM', 'Emergency: Always reachable'] },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'general' },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await contactApi.submit(data);
      setSubmitted(true);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <div className="w-8 h-px bg-brand-400" />
          Get In Touch
          <div className="w-8 h-px bg-brand-400" />
        </div>
        <h1 className="section-title mb-4">
          Let's Start a <span className="gradient-text">Conversation</span>
        </h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Whether you have a question about our products, need a custom quote, or want to discuss
          a partnership — we're here and ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <info.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{info.title}</p>
                {info.lines.map(line => (
                  <p key={line} className="text-dark-400 text-sm">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-dark-800/60 h-48 flex items-center justify-center mt-8">
            <div className="text-center space-y-2">
              <MapPin className="w-8 h-8 text-brand-400 mx-auto" />
              <p className="text-sm text-dark-400">Bole Sub-city, Addis Ababa</p>
              <a
                href="https://maps.google.com/?q=Bole+Addis+Ababa+Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-10 text-center space-y-5 h-full flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">Message Sent!</h3>
                <p className="text-dark-300">We've received your message and will respond within 24 hours.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">Send Another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-5">

              {/* Inquiry Type */}
              <div>
                <label className="label">Type of Inquiry</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {inquiryTypes.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setValue('type', t.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                        selectedType === t.value
                          ? 'bg-brand-600/20 border-brand-500/40 text-brand-300'
                          : 'bg-dark-800/40 border-white/5 text-dark-400 hover:border-white/10 hover:text-white'
                      )}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input {...register('name')} placeholder="Yohannes Tadesse" className="input-field" />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input {...register('email')} type="email" placeholder="email@company.com" className="input-field" />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input {...register('phone')} placeholder="+251 911 000 000" className="input-field" />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input {...register('company')} placeholder="Your Company Ltd." className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Subject *</label>
                <input {...register('subject')} placeholder="e.g. Bulk order inquiry for 10,000 bags" className="input-field" />
                {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea {...register('message')} rows={5} placeholder="Describe your requirements in detail..." className="input-field resize-none" />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
