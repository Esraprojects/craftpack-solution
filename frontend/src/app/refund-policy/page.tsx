import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Refund Policy — Craftpack Solution' };

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-4">Refund Policy</h1>
        </div>
        <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Custom Orders</h2>
            <p>Due to the custom nature of our products, we cannot offer refunds on orders that have entered production. Deposits are non-refundable once artwork has been approved and production has begun.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Defective Products</h2>
            <p>If your order contains defective or damaged items, please contact us within 7 days of delivery with photos. We will replace defective items at no additional cost.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">Order Cancellations</h2>
            <p>Cancellations must be requested before artwork approval. Contact us immediately at <a href="mailto:info@craftpacksolution.com" className="text-brand-600 dark:text-brand-400 underline">info@craftpacksolution.com</a>.</p>
          </section>
        </div>
        <Link href="/" className="btn-secondary w-fit">← Back to Home</Link>
      </div>
    </div>
  );
}
