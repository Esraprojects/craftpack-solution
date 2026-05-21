import type { Metadata } from 'next';
import QuoteForm from '@/components/forms/QuoteForm';

export const metadata: Metadata = {
  title: 'Request a Quote — Craftpack Solution',
  description: 'Get a custom quote for your paper bag and packaging needs. Wholesale pricing, bulk orders, and custom branding available. 24-hour response guaranteed.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider mb-4">
            <div className="w-8 h-px bg-brand-400" />
            Free Quote
            <div className="w-8 h-px bg-brand-400" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Get Your Custom <span className="gradient-text">Quote</span>
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Fill out the form below and our packaging specialists will get back to you
            with a detailed quote within 24 hours.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-dark-400">
            {['24hr Response', 'No Obligation', 'Expert Advice', 'Volume Discounts'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <QuoteForm />
      </div>
    </div>
  );
}
