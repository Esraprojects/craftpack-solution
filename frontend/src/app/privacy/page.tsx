import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Craftpack Solution',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>
        </div>
        <div className="prose dark:prose-invert space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as when you request a quote, contact us, or create an account. This includes your name, email address, phone number, company name, and order details.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">2. How We Use Your Information</h2>
            <p>We use your information to process orders, respond to enquiries, send quotes, and improve our services. We do not sell your personal data to third parties.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">3. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or disclosure.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display">4. Contact Us</h2>
            <p>For privacy-related enquiries, contact us at <a href="mailto:info@craftpacksolution.com" className="text-brand-600 dark:text-brand-400 underline">info@craftpacksolution.com</a>.</p>
          </section>
        </div>
        <Link href="/" className="btn-secondary w-fit">← Back to Home</Link>
      </div>
    </div>
  );
}
