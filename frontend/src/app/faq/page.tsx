import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'FAQ — Craftpack Solution', description: 'Frequently asked questions about Craftpack Solution packaging, orders, and delivery.' };

const faqs = [
  { q: 'What is the minimum order quantity?', a: 'Our minimum order depends on the product type. Standard kraft bags start at 500 units, luxury bags at 100–200 units, and eco bags at 1,000 units. We can sometimes accommodate smaller orders — contact us to discuss.' },
  { q: 'How long does production take?', a: 'Standard orders take 7–14 business days after artwork approval. Rush orders (3–5 days) are available for standard products at a premium. Large bulk orders (50,000+) may take 21–28 days.' },
  { q: 'Do you offer custom sizes?', a: 'Yes — we manufacture bags to any custom dimension. Simply provide your measurements (width × height × depth) and we will produce a sample for your approval before full production.' },
  { q: 'Can I print my logo on the bags?', a: 'Absolutely. We offer 1–4 color printing as standard, and full-color digital printing for premium ranges. We support CMYK, Pantone, and can add foil stamping, embossing, or spot UV.' },
  { q: 'What file formats do you accept for artwork?', a: 'We accept AI, PDF, PSD, and EPS files at 300 DPI or higher. Our design team can also create artwork from your logo at no extra charge for orders above 2,000 units.' },
  { q: 'Do you deliver outside Addis Ababa?', a: 'Yes, we deliver across Ethiopia via courier partners. International export is also available. Shipping costs are calculated at order confirmation based on destination and quantity.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfer (CBE, Awash, Dashen), mobile money (Telebirr), and cash for local orders. For export orders, we accept SWIFT wire transfer. 50% deposit is required to start production.' },
  { q: 'Do you offer eco-friendly options?', a: 'Yes — we have a full range of FSC-certified recycled paper bags, compostable options, and bags printed with soy-based inks. These are available at similar pricing to standard products.' },
  { q: 'Can I get a sample before placing a full order?', a: 'Yes. We offer a sample service for a small fee (refunded on your first order above 1,000 units). Samples are produced within 3–5 business days.' },
  { q: 'What if I am not satisfied with the quality?', a: 'We stand behind our quality with a 100% satisfaction guarantee. If products do not match the approved sample, we will reprint or refund. All orders are quality-checked before dispatch.' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">FAQ</p>
          <h1 className="section-title mb-6">Frequently Asked <span className="gradient-text">Questions</span></h1>
          <p className="section-subtitle">Everything you need to know about ordering from Craftpack Solution.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-6 space-y-3">
              <h3 className="font-display font-bold text-zinc-900 dark:text-white">{faq.q}</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="card p-10 text-center space-y-5">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">Still Have Questions?</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Our team is ready to help you find the perfect packaging solution.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary gap-2">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/quote" className="btn-secondary">Get a Quote</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
