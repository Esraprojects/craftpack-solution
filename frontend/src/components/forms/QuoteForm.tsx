'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Send, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { quotesApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const schema = z.object({
  companyName:         z.string().min(2, 'Company name required'),
  contactName:         z.string().min(2, 'Contact name required'),
  email:               z.string().email('Valid email required'),
  phone:               z.string().min(8, 'Phone number required'),
  deliveryDate:        z.string().optional(),
  budget:              z.string().optional(),
  specialRequirements: z.string().optional(),
  products: z.array(z.object({
    productName:   z.string().min(2, 'Product name required'),
    category:      z.string().min(1, 'Category required'),
    quantity:      z.number({ invalid_type_error: 'Enter a number' }).int().positive('Must be positive'),
    size:          z.string().optional(),
    material:      z.string().optional(),
    customization: z.string().optional(),
  })).min(1, 'Add at least one product'),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = ['Paper Bags', 'Shopping Bags', 'Kraft Bags', 'Luxury Bags', 'Food Packaging', 'Gift Bags', 'Custom Printed', 'Eco-Friendly', 'Industrial'];
const MATERIALS  = ['Kraft Paper', 'Art Paper', 'Recycled Paper', 'Coated Paper', 'Duplex Board', 'Ivory Board', 'Corrugated'];

export default function QuoteForm() {
  const [step, setStep]       = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      products: [{ productName: '', category: '', quantity: 0, size: '', material: '', customization: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await quotesApi.submit(data);
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fields1 = ['companyName', 'contactName', 'email', 'phone'] as const;
    const valid = await trigger(step === 1 ? fields1 : ['products']);
    if (valid) setStep(s => s + 1);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-12 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Quote Request Submitted!</h2>
          <p className="text-dark-300">
            Thank you for your interest. Our team will review your requirements and
            send you a detailed quote within <strong className="text-white">24 hours</strong>.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">Submit Another</button>
          <a href="tel:+251911000000" className="btn-primary text-sm">Call Us Now</a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { n: 1, label: 'Contact Info' },
          { n: 2, label: 'Products'     },
          { n: 3, label: 'Review'       },
        ].map(({ n, label }) => (
          <div key={n} className={cn('flex items-center gap-2', n < 3 && 'flex-1')}>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
              step >= n
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'bg-transparent border-dark-600 text-dark-500'
            )}>
              {n}
            </div>
            <span className={cn('text-sm hidden sm:block', step >= n ? 'text-white' : 'text-dark-500')}>{label}</span>
            {n < 3 && <div className={cn('h-px flex-1', step > n ? 'bg-brand-500' : 'bg-dark-700')} />}
          </div>
        ))}
      </div>

      <div className="card p-6 md:p-8">
        <AnimatePresence mode="wait">

          {/* Step 1: Contact */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-1">Contact Information</h2>
                <p className="text-dark-400 text-sm">Tell us who we're speaking with</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Company Name *</label>
                  <input {...register('companyName')} placeholder="Hyatt Regency Ethiopia" className="input-field" />
                  {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName.message}</p>}
                </div>
                <div>
                  <label className="label">Contact Name *</label>
                  <input {...register('contactName')} placeholder="Yohannes Tadesse" className="input-field" />
                  {errors.contactName && <p className="text-xs text-red-400 mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input {...register('email')} type="email" placeholder="procurement@hyatt.com" className="input-field" />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input {...register('phone')} placeholder="+251 911 000 000" className="input-field" />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label">Required By (Date)</label>
                  <input {...register('deliveryDate')} type="date" className="input-field" />
                </div>
                <div>
                  <label className="label">Approximate Budget (ETB)</label>
                  <input {...register('budget')} placeholder="e.g. 50,000 – 100,000" className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Special Requirements</label>
                <textarea {...register('specialRequirements')} placeholder="Any special certifications, delivery requirements, design preferences..." rows={3} className="input-field resize-none" />
              </div>
            </motion.div>
          )}

          {/* Step 2: Products */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-1">Products Required</h2>
                <p className="text-dark-400 text-sm">Add the products you'd like to order</p>
              </div>

              <div className="space-y-4">
                {fields.map((field, i) => (
                  <div key={field.id} className="p-5 rounded-2xl bg-dark-800/60 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Product {i + 1}</span>
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(i)} className="text-dark-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Product Name *</label>
                        <input {...register(`products.${i}.productName`)} placeholder="e.g. Shopping Bag" className="input-field" />
                        {errors.products?.[i]?.productName && <p className="text-xs text-red-400 mt-1">{errors.products[i]?.productName?.message}</p>}
                      </div>
                      <div>
                        <label className="label">Category *</label>
                        <select {...register(`products.${i}.category`)} className="input-field">
                          <option value="">Select category</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.products?.[i]?.category && <p className="text-xs text-red-400 mt-1">{errors.products[i]?.category?.message}</p>}
                      </div>
                      <div>
                        <label className="label">Quantity *</label>
                        <input {...register(`products.${i}.quantity`, { valueAsNumber: true })} type="number" min="1" placeholder="e.g. 5000" className="input-field" />
                        {errors.products?.[i]?.quantity && <p className="text-xs text-red-400 mt-1">{errors.products[i]?.quantity?.message}</p>}
                      </div>
                      <div>
                        <label className="label">Size</label>
                        <input {...register(`products.${i}.size`)} placeholder="e.g. 30cm × 40cm × 12cm" className="input-field" />
                      </div>
                      <div>
                        <label className="label">Material</label>
                        <select {...register(`products.${i}.material`)} className="input-field">
                          <option value="">Select material</option>
                          {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Customization Notes</label>
                        <input {...register(`products.${i}.customization`)} placeholder="Logo, colors, finish..." className="input-field" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => append({ productName: '', category: '', quantity: 0, size: '', material: '', customization: '' })}
                className="w-full py-3 rounded-2xl border border-dashed border-white/10 hover:border-brand-500/40 text-sm text-dark-400 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Another Product
              </button>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-1">Review & Submit</h2>
                <p className="text-dark-400 text-sm">Review your details before submitting</p>
              </div>

              <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/5 space-y-3">
                <p className="text-sm font-medium text-white">Contact</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: 'Company', value: watch('companyName') },
                    { label: 'Contact', value: watch('contactName') },
                    { label: 'Email',   value: watch('email') },
                    { label: 'Phone',   value: watch('phone') },
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-dark-500">{item.label}: </span>
                      <span className="text-dark-200">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/5 space-y-3">
                <p className="text-sm font-medium text-white">Products ({watch('products').length})</p>
                {watch('products').map((p, i) => (
                  <div key={i} className="text-sm text-dark-300 flex justify-between">
                    <span>{p.productName || 'Unnamed'} ({p.category})</span>
                    <span className="font-medium text-white">{p.quantity?.toLocaleString()} units</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-brand-900/20 border border-brand-500/20 text-sm text-brand-300">
                By submitting, you agree to our terms. We'll contact you within 24 hours with pricing.
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation */}
        <div className={cn('flex gap-3 mt-8', step > 1 ? 'justify-between' : 'justify-end')}>
          {step > 1 && (
            <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isLoading} className="btn-gold">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Quote Request</>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
