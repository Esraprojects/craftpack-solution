'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ShoppingCart, FileText, Star, Leaf, Shield,
  Package, CheckCircle, ChevronRight, Truck, RefreshCw, Award
} from 'lucide-react';

const ALL_PRODUCTS: Record<string, {
  name: string; category: string; basePrice: number; minOrder: number;
  description: string; isEco: boolean; isBestseller: boolean;
  features: string[]; sizes: { label: string; price: number }[];
  applications: string[]; material: string;
}> = {
  'premium-kraft-shopping-bag': {
    name: 'Premium Kraft Shopping Bag', category: 'Shopping Bags', basePrice: 12.50, minOrder: 500,
    material: '150gsm Natural Kraft Paper', isEco: true, isBestseller: true,
    description: 'Our signature Premium Kraft Shopping Bag combines durability with aesthetic appeal. Made from 100% natural kraft paper with reinforced handles, it offers an excellent canvas for custom printing and branding. Perfect for retail boutiques, fashion stores, and corporate gifting.',
    features: ['Heavy-duty 150gsm kraft paper', 'Reinforced rope handles', 'Flat bottom for stability', 'Custom printing up to 4 colors', 'Water-resistant coating option', 'Biodegradable materials'],
    sizes: [{ label: 'Small (20×25×10cm)', price: 8.50 }, { label: 'Medium (30×40×12cm)', price: 12.50 }, { label: 'Large (40×50×15cm)', price: 18.00 }],
    applications: ['Retail boutiques', 'Fashion stores', 'Gift shops', 'Corporate events', 'Hotels'],
  },
  'luxury-matte-laminated-bag': {
    name: 'Luxury Matte Laminated Bag', category: 'Luxury Bags', basePrice: 28.00, minOrder: 200,
    material: 'Art Paper with Matte Lamination', isEco: false, isBestseller: false,
    description: 'Experience the pinnacle of packaging luxury with our Matte Laminated Bag. Featuring a soft-touch matte lamination finish with optional hot foil stamping, this bag communicates premium brand values. Perfect for high-end retail and VIP events.',
    features: ['Soft-touch matte lamination', 'Gold/silver foil stamping available', 'Rigid board construction', 'Grosgrain ribbon handles', 'Spot UV coating option', 'Magnetic closure available'],
    sizes: [{ label: 'Medium (25×30×10cm)', price: 28.00 }, { label: 'Large (35×45×13cm)', price: 38.00 }],
    applications: ['Luxury retail', 'Jewelry stores', 'Premium brands', 'Corporate gifts', 'VIP events'],
  },
  'eco-recycled-paper-bag': {
    name: 'Eco Recycled Paper Bag', category: 'Eco-Friendly', basePrice: 8.75, minOrder: 1000,
    material: '100% Recycled Paper (FSC Certified)', isEco: true, isBestseller: true,
    description: '100% recycled and biodegradable paper bag certified by FSC. Made from post-consumer recycled content with a natural, unbleached appearance. Perfect for brands that want to showcase their environmental commitment.',
    features: ['100% recycled paper content', 'Biodegradable in 90 days', 'FSC & ISO 14001 certified', 'Soy-based inks for printing', 'Natural fiber handles', 'Compostable option available'],
    sizes: [{ label: 'Small (20×25×8cm)', price: 6.50 }, { label: 'Medium (30×35×10cm)', price: 8.75 }, { label: 'Large (40×45×15cm)', price: 12.00 }],
    applications: ['Eco-conscious brands', 'Organic stores', 'Farmers markets', 'Sustainable events', 'Green hotels'],
  },
  'food-grade-paper-bag': {
    name: 'Food-Grade Paper Bag', category: 'Food Packaging', basePrice: 6.50, minOrder: 2000,
    material: 'Food-Safe Greaseproof Paper', isEco: true, isBestseller: false,
    description: 'Hygienic, food-safe paper bags designed for bakeries, cafes, and restaurants. Made with FDA-compliant greaseproof paper that prevents oil and moisture penetration while keeping food fresh.',
    features: ['FDA-compliant food-safe materials', 'Greaseproof inner lining', 'Moisture-resistant coating', 'Breathable design keeps food fresh', 'Custom logo printing', 'Available in multiple sizes'],
    sizes: [{ label: 'Small (15×20×6cm)', price: 4.50 }, { label: 'Medium (20×28×8cm)', price: 6.50 }, { label: 'Large (28×35×10cm)', price: 8.00 }],
    applications: ['Bakeries', 'Cafes & restaurants', 'Fast food outlets', 'Street food vendors', 'Catering services'],
  },
  'corporate-gift-box-bag': {
    name: 'Corporate Gift Box Bag', category: 'Gift Bags', basePrice: 35.00, minOrder: 100,
    material: 'Rigid Ivory Board', isEco: false, isBestseller: false,
    description: 'Premium rigid gift box bags for corporate gifting, product launches, and VIP events. The sturdy construction keeps gifts safe while the luxurious finish impresses recipients. Fully customizable with your brand identity.',
    features: ['Rigid ivory board construction', 'Magnetic snap closure', 'Satin ribbon handles', 'Full-color custom printing', 'Tissue paper lining included', 'Embossing & foil options'],
    sizes: [{ label: 'Small (20×15×8cm)', price: 28.00 }, { label: 'Medium (30×22×10cm)', price: 35.00 }, { label: 'Large (40×30×15cm)', price: 48.00 }],
    applications: ['Corporate gifting', 'Product launches', 'Award ceremonies', 'Wedding favors', 'Holiday gifts'],
  },
  'bulk-industrial-craft-bag': {
    name: 'Bulk Industrial Craft Bag', category: 'Industrial', basePrice: 4.20, minOrder: 5000,
    material: 'Heavy-Duty Kraft (200gsm)', isEco: true, isBestseller: false,
    description: 'Heavy-duty industrial craft bags for bulk packaging needs. Designed for supermarkets, wholesalers, and industrial use. Exceptionally strong construction handles heavy loads without tearing.',
    features: ['200gsm heavy-duty kraft paper', 'Reinforced base and seams', 'Load capacity up to 10kg', 'Pinch-bottom or flat-bottom design', 'Natural kraft or white finish', 'Bulk pricing available'],
    sizes: [{ label: 'Medium (30×40cm)', price: 3.50 }, { label: 'Large (40×55cm)', price: 4.20 }, { label: 'XL (50×70cm)', price: 5.80 }],
    applications: ['Supermarkets', 'Wholesale stores', 'Hardware shops', 'Agricultural supply', 'Warehousing'],
  },
  'boutique-fashion-tote': {
    name: 'Boutique Fashion Tote', category: 'Shopping Bags', basePrice: 18.00, minOrder: 300,
    material: 'Art Paper 200gsm', isEco: false, isBestseller: true,
    description: 'Elegant fashion tote bags that elevate your brand. Designed for boutiques and fashion retailers who want packaging that doubles as a style statement. Available with glossy or matte finish.',
    features: ['Premium art paper 200gsm', 'Glossy or matte lamination', 'Rope or ribbon handles', 'Full-bleed custom printing', 'Tissue paper insert option', 'Spot UV highlights'],
    sizes: [{ label: 'Small (22×28×10cm)', price: 14.00 }, { label: 'Medium (30×36×12cm)', price: 18.00 }, { label: 'Large (38×45×14cm)', price: 24.00 }],
    applications: ['Fashion boutiques', 'Clothing stores', 'Shoe stores', 'Accessories shops', 'Pop-up retail'],
  },
  'luxury-rigid-gift-bag': {
    name: 'Luxury Rigid Gift Bag', category: 'Luxury Bags', basePrice: 45.00, minOrder: 50,
    material: 'Premium Rigid Cardboard + Velvet Lining', isEco: false, isBestseller: false,
    description: 'The ultimate in luxury packaging. Hand-assembled rigid gift bags with velvet interior lining, gold/silver foil detailing, and premium satin ribbon. Ideal for jewelry, watches, and high-value products.',
    features: ['Hand-assembled rigid construction', 'Velvet or satin interior lining', 'Gold/silver foil stamping', 'Magnetic or ribbon closure', 'Custom embossing available', 'Gift tissue paper included'],
    sizes: [{ label: 'Small (18×12×8cm)', price: 38.00 }, { label: 'Medium (25×18×10cm)', price: 45.00 }, { label: 'Large (32×24×14cm)', price: 62.00 }],
    applications: ['Jewelry stores', 'Watch boutiques', 'Luxury cosmetics', 'High-end gifts', 'VIP client gifting'],
  },
  'bakery-window-paper-bag': {
    name: 'Bakery Window Paper Bag', category: 'Food Packaging', basePrice: 5.80, minOrder: 1500,
    material: 'Greaseproof Paper + PLA Window', isEco: true, isBestseller: false,
    description: 'Showcase your baked goods through our clear window paper bags. The transparent window lets customers see the product while the greaseproof paper keeps everything fresh and clean.',
    features: ['Clear PLA or PET window panel', 'Greaseproof inner coating', 'Flat or gusseted bottom', 'Custom logo printing', 'Food-safe materials', 'Window size customizable'],
    sizes: [{ label: 'Small (12×18cm)', price: 4.00 }, { label: 'Medium (18×25cm)', price: 5.80 }, { label: 'Large (25×35cm)', price: 7.50 }],
    applications: ['Bakeries', 'Pastry shops', 'Cafes', 'Cookie shops', 'Food markets'],
  },
  'white-gloss-laminated-bag': {
    name: 'White Gloss Laminated Bag', category: 'Paper Bags', basePrice: 15.00, minOrder: 400,
    material: 'White Art Paper with Gloss Lamination', isEco: false, isBestseller: false,
    description: 'Clean, professional white gloss laminated bags that make your brand pop. The high-gloss finish gives a premium look at an accessible price point, ideal for retail and promotional use.',
    features: ['High-gloss lamination finish', 'Vivid full-color printing', 'Cotton rope or twisted handles', 'Reinforced base', 'Multiple size options', 'Quick turnaround available'],
    sizes: [{ label: 'Small (20×25×8cm)', price: 11.00 }, { label: 'Medium (28×36×10cm)', price: 15.00 }, { label: 'Large (36×46×14cm)', price: 20.00 }],
    applications: ['Retail stores', 'Promotional events', 'Trade shows', 'Brand activations', 'Product launches'],
  },
};

const FALLBACK = {
  name: 'Custom Paper Bag', category: 'Paper Bags', basePrice: 10.00, minOrder: 500,
  material: 'Kraft Paper', isEco: true, isBestseller: false,
  description: 'High-quality custom paper bags tailored to your specifications. Contact us for a custom quote.',
  features: ['Custom sizes available', 'Full-color printing', 'Various handle options', 'Custom materials', 'Bulk pricing'],
  sizes: [{ label: 'Standard', price: 10.00 }],
  applications: ['Retail', 'Events', 'Corporate'],
};

const bulkTiers = [
  { qty: '500–999',    discount: '0%',  label: 'Standard' },
  { qty: '1,000–4,999', discount: '14%', label: 'Volume' },
  { qty: '5,000–19,999', discount: '26%', label: 'Bulk' },
  { qty: '20,000+',   discount: '38%', label: 'Enterprise' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const product = ALL_PRODUCTS[slug] ?? FALLBACK;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left – Visual */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/50 dark:from-zinc-800/50 to-transparent" />
              <Package className="w-32 h-32 text-zinc-300 dark:text-zinc-700" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                {product.isEco && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    <Leaf className="w-3 h-3" /> Eco-Certified
                  </div>
                )}
                {product.isBestseller && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/10 dark:bg-white/10 border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" /> Bestseller
                  </div>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Truck,    label: 'Fast Delivery' },
                { icon: Shield,   label: 'Quality Assured' },
                { icon: RefreshCw, label: 'Custom Orders' },
              ].map(b => (
                <div key={b.label} className="card p-3 flex flex-col items-center gap-1.5 text-center">
                  <b.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white mb-4">{product.name}</h1>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="card p-5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Starting from</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
                  {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(product.basePrice * 55)}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">per unit</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Min. order: {product.minOrder.toLocaleString()} units · Material: {product.material}</p>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Available Sizes</p>
              <div className="grid gap-2">
                {product.sizes.map(s => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.label}</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(s.price * 55)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Features</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bulk Pricing */}
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Bulk Pricing Tiers</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {bulkTiers.map(t => (
                  <div key={t.qty} className="card p-3 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t.label}</p>
                    <p className="font-bold text-zinc-900 dark:text-white text-lg mt-1">{t.discount}</p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">{t.qty} units</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/quote" className="btn-primary flex-1 justify-center gap-2">
                <FileText className="w-4 h-4" /> Request a Quote
              </Link>
              <Link href="/contact" className="btn-secondary flex-1 justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Talk to Sales
              </Link>
            </div>

            {/* Applications */}
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Applications</p>
              <div className="flex flex-wrap gap-2">
                {product.applications.map(a => (
                  <span key={a} className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">{a}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-white/5">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </Link>
        </div>
      </div>
    </div>
  );
}
