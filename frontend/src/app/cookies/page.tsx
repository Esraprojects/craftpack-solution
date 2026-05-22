import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Cookie Policy — Craftpack Solution' };

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-4">Cookie Policy</h1>
        </div>
        <div className="space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>We use essential cookies to keep you logged in and remember your preferences. We do not use tracking or advertising cookies.</p>
          <p>By using our website, you consent to our use of essential cookies. You can disable cookies in your browser settings, but some features may not work correctly.</p>
        </div>
        <Link href="/" className="btn-secondary w-fit">← Back to Home</Link>
      </div>
    </div>
  );
}
