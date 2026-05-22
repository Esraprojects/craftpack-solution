import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Craftpack Solution',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>
        </div>
        <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">1. Orders & Minimum Quantities</h2>
            <p>All orders are subject to our minimum order quantities. Quotes are valid for 14 days from issue date. Payment terms are agreed at the time of order confirmation.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">2. Production & Lead Times</h2>
            <p>Standard lead time is 7–14 business days from artwork approval and deposit payment. Rush orders may be accommodated subject to capacity and additional charges.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">3. Artwork & Approvals</h2>
            <p>Customers must approve all artwork proofs before production begins. Craftpack Solution is not responsible for errors in approved artwork.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">4. Contact</h2>
            <p>Questions? Email <a href="mailto:info@craftpacksolution.com" className="text-brand-600 dark:text-brand-400 underline">info@craftpacksolution.com</a>.</p>
          </section>
        </div>
        <Link href="/" className="btn-secondary w-fit">← Back to Home</Link>
      </div>
    </div>
  );
}
