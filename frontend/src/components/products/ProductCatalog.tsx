'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search, Grid3X3, List, X, Star, Leaf, ShoppingCart,
  ChevronDown, Package, Tag, MessageCircle, Phone, Check,
  Plus, Minus, Layers, UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/* ════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════ */
const WA_PHONES = [
  { label: '0901 236 509', wa: '251901236509' },
  { label: '0957 117 787', wa: '251957117787' },
  { label: '0910 628 159', wa: '251910628159' },
];

const ROPE_COLORS = [
  { value: 'natural',  label: 'Natural Kraft', hex: '#c8a97e' },
  { value: 'white',    label: 'White',          hex: '#f5f0e8' },
  { value: 'black',    label: 'Black',           hex: '#222222' },
  { value: 'brown',    label: 'Brown',           hex: '#7c5c3a' },
  { value: 'red',      label: 'Red',             hex: '#dc2626' },
  { value: 'navy',     label: 'Navy Blue',       hex: '#1e3a8a' },
  { value: 'green',    label: 'Forest Green',    hex: '#166534' },
];

const LOGO_SURCHARGE = 7; // ETB per bag for 2-side printing

const FRAME_SIZES = [
  { label: 'A5', price: 1200 },
  { label: 'A4', price: 1800 },
  { label: 'A3', price: 2200 },
];

const CATEGORIES = [
  { id: 'all',           label: 'All Products',         count: 27 },
  { id: 'kraft_bags',    label: 'Kraft Paper Bags',     count: 4  },
  { id: 'duplex_bags',   label: 'White Duplex Bags',    count: 4  },
  { id: 'takeaway_bags', label: 'Take Away Bags',       count: 1  },
  { id: 'cake_boxes',    label: 'Cake & Cookies Boxes', count: 9  },
  { id: 'raw_materials', label: 'Raw Materials',        count: 12 },
];

/* encode spaces in image filenames for use as URL src */
const img = (name: string) => `/images/${name.replace(/ /g, '%20')}`;

/* ════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
interface BagVariant { label: string; price: number; slug: string }
interface GroupedProduct {
  id: string;
  name: string;
  category: 'kraft_bags' | 'duplex_bags' | 'takeaway_bags';
  variants: [BagVariant, BagVariant];
  imageStem: string;   // base filename without "-logo.png" / "-plain.png"
  rating: number; reviews: number;
  isEco: boolean; isBestseller: boolean;
  minOrder: number; color: string; desc: string;
}

const GROUPED: GroupedProduct[] = [
  /* ── Kraft Paper Bags ─────────────────────────────────────────── */
  {
    id:'kg-s', name:'Kraft Paper Bag — Small', category:'kraft_bags',
    variants:[{label:'With Logo',price:39,slug:'kraft-bag-small-logo'},{label:'Plain',price:29,slug:'kraft-bag-small-plain'}],
    imageStem:'kraft-bag-small',
    rating:4.9, reviews:214, isEco:true, isBestseller:true, minOrder:200, color:'#c8a97e',
    desc:'Best for cafes, juice bars and small boutique retail.',
  },
  {
    id:'kg-m', name:'Kraft Paper Bag — Medium', category:'kraft_bags',
    variants:[{label:'With Logo',price:45,slug:'kraft-bag-medium-logo'},{label:'Plain',price:32,slug:'kraft-bag-medium-plain'}],
    imageStem:'kraft-bag-medium',
    rating:4.9, reviews:186, isEco:true, isBestseller:true, minOrder:200, color:'#b8936a',
    desc:'Most popular size. Ideal for retail, bakeries and gift shops.',
  },
  {
    id:'kg-l', name:'Kraft Paper Bag — Large', category:'kraft_bags',
    variants:[{label:'With Logo',price:53,slug:'kraft-bag-large-logo'},{label:'Plain',price:37,slug:'kraft-bag-large-plain'}],
    imageStem:'kraft-bag-large',
    rating:4.8, reviews:142, isEco:true, isBestseller:false, minOrder:200, color:'#a07850',
    desc:'Ideal for supermarkets, garments and large retail orders.',
  },
  {
    id:'kg-x', name:'Kraft Paper Bag — Extra Large', category:'kraft_bags',
    variants:[{label:'With Logo',price:60,slug:'kraft-bag-xl-logo'},{label:'Plain',price:47,slug:'kraft-bag-xl-plain'}],
    imageStem:'kraft-bag-extra large',
    rating:4.8, reviews:98, isEco:true, isBestseller:false, minOrder:200, color:'#8c6438',
    desc:'For wholesalers, event gifting and corporate bulk orders.',
  },
  /* ── White Duplex Bags ────────────────────────────────────────── */
  {
    id:'dg-s', name:'White Duplex Bag — Small', category:'duplex_bags',
    variants:[{label:'With Logo',price:43,slug:'duplex-bag-small-logo'},{label:'Plain',price:33,slug:'duplex-bag-small-plain'}],
    imageStem:'white duplex-bag-small',
    rating:5.0, reviews:167, isEco:false, isBestseller:true, minOrder:200, color:'#f0ece4',
    desc:'Clean white finish. Perfect for cosmetics and boutiques.',
  },
  {
    id:'dg-m', name:'White Duplex Bag — Medium', category:'duplex_bags',
    variants:[{label:'With Logo',price:53,slug:'duplex-bag-medium-logo'},{label:'Plain',price:43,slug:'duplex-bag-medium-plain'}],
    imageStem:'white duplex-bag-medium',
    rating:4.9, reviews:148, isEco:false, isBestseller:true, minOrder:200, color:'#e8e2d8',
    desc:'Premium look for fashion brands and high-end retail.',
  },
  {
    id:'dg-l', name:'White Duplex Bag — Large', category:'duplex_bags',
    variants:[{label:'With Logo',price:60,slug:'duplex-bag-large-logo'},{label:'Plain',price:53,slug:'duplex-bag-large-plain'}],
    imageStem:'white duplex-bag-large',
    rating:4.9, reviews:112, isEco:false, isBestseller:false, minOrder:200, color:'#e0d8cc',
    desc:'Excellent for upscale retail, hotels and corporate gifts.',
  },
  {
    id:'dg-x', name:'White Duplex Bag — Extra Large', category:'duplex_bags',
    variants:[{label:'With Logo',price:75,slug:'duplex-bag-xl-logo'},{label:'Plain',price:65,slug:'duplex-bag-xl-plain'}],
    imageStem:'white duplex-bag-extra large',
    rating:4.8, reviews:76, isEco:false, isBestseller:false, minOrder:200, color:'#d8d0c4',
    desc:'Luxury large-format bag for premium brands and events.',
  },
  /* ── Take Away Bags ───────────────────────────────────────────── */
  {
    id:'ta-m', name:'Take Away Kraft Bag — Medium', category:'takeaway_bags',
    variants:[{label:'With Logo',price:48,slug:'takeaway-bag-medium-logo'},{label:'Plain',price:36,slug:'takeaway-bag-medium-plain'}],
    imageStem:'Take away kraft-bag-medium',
    rating:4.9, reviews:163, isEco:true, isBestseller:true, minOrder:200, color:'#c8a97e',
    desc:'Flat-bottom take away bag. Perfect for restaurants, food courts and delivery.',
  },
];

interface SingleProduct {
  id: string; name: string; slug: string; category: string;
  basePrice: number; rating: number; reviews: number;
  isEco: boolean; isBestseller: boolean; minOrder: number;
  color: string; tag: string; desc: string;
  image?: string;   // real product photo path (optional)
}

const SINGLES: SingleProduct[] = [
  /* ── Cake & Cookies Boxes ─────────────────────────────────────── */
  {
    id:'b7', name:'½kg Cake Box (with Logo)',          slug:'cake-box-half-logo',          category:'cake_boxes',
    basePrice:45,  rating:4.9, reviews:221, isEco:false, isBestseller:true,  minOrder:500,
    color:'#fef3c7', tag:'½kg',        desc:'Most popular for mini cakes, pastry slices and take-away.',
    image: img('half kg cake box-logo.png'),
  },
  {
    id:'b8', name:'½kg Cake Box (Window + Logo)',      slug:'cake-box-half-window-logo',   category:'cake_boxes',
    basePrice:50,  rating:4.8, reviews:187, isEco:false, isBestseller:false, minOrder:500,
    color:'#fde68a', tag:'½kg Window', desc:'Gift-ready half-kilo cake box with transparent display window.',
    image: img('half kg cake box-window-logo.png'),
  },
  {
    id:'b9', name:'½kg Cake Box — Plain',              slug:'cake-box-half-plain',         category:'cake_boxes',
    basePrice:38,  rating:4.7, reviews:142, isEco:false, isBestseller:false, minOrder:500,
    color:'#fef3c7', tag:'½kg Plain',  desc:'Plain half-kilo box. Add your own branding or use as-is.',
    image: img('half kg cake box-plain.png'),
  },
  {
    id:'b1', name:'1kg Cake Box (Window + Logo)',      slug:'cake-box-1kg-window-logo',    category:'cake_boxes',
    basePrice:70,  rating:5.0, reviews:178, isEco:false, isBestseller:true,  minOrder:500,
    color:'#fbbf24', tag:'1kg Window', desc:'PVC window box with logo. Perfect for premium display and gifting.',
    image: img('1kg cake box-window-logo.png'),
  },
  {
    id:'b2', name:'1kg Cake Box (Window — Plain)',     slug:'cake-box-1kg-window-plain',   category:'cake_boxes',
    basePrice:60,  rating:4.8, reviews:134, isEco:false, isBestseller:false, minOrder:500,
    color:'#fde68a', tag:'1kg Window', desc:'1kg window box without print. Ready for custom stickers or wrap.',
    image: img('1kg cake box-window-plain.png'),
  },
  {
    id:'b3', name:'1kg Cake Box — Plain',              slug:'cake-box-1kg-plain',          category:'cake_boxes',
    basePrice:55,  rating:4.7, reviews:116, isEco:false, isBestseller:false, minOrder:500,
    color:'#fef3c7', tag:'1kg Plain',  desc:'Standard 1kg cake box, unprinted. Solid and sturdy.',
    image: img('1kg cake box-plain.png'),
  },
  {
    id:'b4', name:'2kg Cake Box (with Logo)',          slug:'cake-box-2kg-logo',           category:'cake_boxes',
    basePrice:80,  rating:4.8, reviews:134, isEco:false, isBestseller:false, minOrder:500,
    color:'#f59e0b', tag:'2kg',        desc:'Large cake box for wedding cakes and catering orders.',
    image: img('2kg cake box-logo.png'),
  },
  {
    id:'b5', name:'2kg Cake Box (Window + Logo)',      slug:'cake-box-2kg-window-logo',    category:'cake_boxes',
    basePrice:90,  rating:4.8, reviews:98,  isEco:false, isBestseller:false, minOrder:500,
    color:'#d97706', tag:'2kg Window', desc:'2kg display box with window — showroom-ready packaging.',
    image: img('2kg cake box-window-logo.png'),
  },
  {
    id:'b6', name:'2kg Cake Box — Plain',              slug:'cake-box-2kg-plain',          category:'cake_boxes',
    basePrice:70,  rating:4.7, reviews:87,  isEco:false, isBestseller:false, minOrder:500,
    color:'#fef3c7', tag:'2kg Plain',  desc:'Large unprinted box. Ideal for events and catering.',
    image: img('2kg cake box-plain.png'),
  },
  /* ── Raw Materials ────────────────────────────────────────────── */
  { id:'r2',  name:'Silkscreen Printer — 1 Handle', slug:'silkscreen-printer-1h',   category:'raw_materials', basePrice:10000, rating:4.9, reviews:43,  isEco:false, isBestseller:false, minOrder:1, color:'#64748b', tag:'Tool',      desc:'Single-handle desktop silkscreen press for small-scale printing.',      image: img('silkscreen printing machine one handle.png') },
  { id:'r4',  name:'Silkscreen Printer — 4 Handle', slug:'silkscreen-printer-4h',   category:'raw_materials', basePrice:35000, rating:5.0, reviews:29,  isEco:false, isBestseller:false, minOrder:1, color:'#334155', tag:'Tool',      desc:'Professional 4-handle press for high-volume printing operations.',      image: img('silkscreen printing machine 4 handles.png') },
  { id:'r5',  name:'Eyelet Puncher',                 slug:'eyelet-puncher',          category:'raw_materials', basePrice:4500,  rating:4.7, reviews:62,  isEco:false, isBestseller:false, minOrder:1, color:'#78716c', tag:'Tool',      desc:'Heavy-duty manual eyelet puncher for installing rope handles.',          image: img('eylet puncher.png') },
  { id:'r6',  name:'Rope Handle — 300m Roll',        slug:'rope-handle-300m',        category:'raw_materials', basePrice:1600,  rating:4.8, reviews:89,  isEco:true,  isBestseller:true,  minOrder:1, color:'#c8a97e', tag:'Material',  desc:'Twisted paper rope handle. 300m per roll, natural kraft colour.' },
  { id:'r7',  name:'Water-Based Ink',                slug:'water-based-ink',         category:'raw_materials', basePrice:2000,  rating:4.8, reviews:74,  isEco:true,  isBestseller:false, minOrder:1, color:'#22d3ee', tag:'per kg',    desc:'Eco-friendly water-based ink. Vibrant colour, quick-dry formula.',       image: img('water base ink-Photoroom.png') },
  { id:'r8',  name:'Plastisol Ink',                  slug:'plastisol-ink',           category:'raw_materials', basePrice:3000,  rating:4.7, reviews:67,  isEco:false, isBestseller:false, minOrder:1, color:'#f59e0b', tag:'per kg',    desc:'High-opacity plastisol ink for silkscreen printing on paper bags.',      image: img('plastisol ink-Photoroom.png') },
  { id:'r9',  name:'Aluminium Squeegee — 15cm',      slug:'squeegee-15cm',           category:'raw_materials', basePrice:2000,  rating:4.8, reviews:91,  isEco:false, isBestseller:false, minOrder:1, color:'#94a3b8', tag:'15cm',      desc:'15cm aluminium squeegee for silkscreen printing on bags and frames.',    image: img('alumunium squeegee 15 cm.png') },
  { id:'r12', name:'Light Box (Exposure Unit)',       slug:'light-box-exposure',      category:'raw_materials', basePrice:0,     rating:4.9, reviews:51,  isEco:false, isBestseller:false, minOrder:1, color:'#fbbf24', tag:'Equipment', desc:'UV exposure unit for burning silkscreen stencils. Professional grade.' },
  { id:'r13', name:'Photo Emulsion (Ulano 925 WR-P)',slug:'photo-emulsion',          category:'raw_materials', basePrice:4500,  rating:4.9, reviews:45,  isEco:false, isBestseller:false, minOrder:1, color:'#7c3aed', tag:'Emulsion',  desc:'Diazo photo emulsion for silkscreen printing. Water-resistant formula.',  image: img('photo emulsion-Photoroom.png') },
];

interface KraftRoll {
  id: string; name: string; size: string;
  rimPrice: number; rimBulkPrice: number;
  kgPrice: number; kgMin: number;
  rollPrice: number; rollMin: number;
}

const KRAFT_ROLLS: KraftRoll[] = [
  { id:'kr1', name:'Kraft Paper Roll — 1M × 70CM', size:'1M × 70CM', rimPrice:2800, rimBulkPrice:2500, kgPrice:255, kgMin:40, rollPrice:215, rollMin:500 },
  { id:'kr2', name:'Kraft Paper Roll — 1M × 55CM', size:'1M × 55CM', rimPrice:2300, rimBulkPrice:2100, kgPrice:255, kgMin:40, rollPrice:215, rollMin:500 },
];

/* ════════════════════════════════════════════════════════════════
   WHATSAPP MODAL
══════════════════════════════════════════════════════════════════ */
function WhatsAppModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm card bg-dark-900 border-white/10 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-white">Send Order via WhatsApp</h3>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-dark-400">Choose which number to send your order to:</p>
        <div className="space-y-2">
          {WA_PHONES.map(phone => (
            <a
              key={phone.wa}
              href={`https://wa.me/${phone.wa}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/25 hover:bg-green-500/20 hover:border-green-500/50 transition-all group"
            >
              <Phone className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300 group-hover:text-green-200">{phone.label}</span>
              <MessageCircle className="w-4 h-4 text-green-500/60 ml-auto" />
            </a>
          ))}
        </div>
        <p className="text-xs text-dark-500 text-center">WhatsApp will open with your order pre-filled</p>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT TOGGLE (sliding pill)
══════════════════════════════════════════════════════════════════ */
function VariantToggle({ variants, active, onChange }: {
  variants: { label: string }[]; active: number; onChange: (i: number) => void;
}) {
  return (
    <div className="relative flex rounded-lg bg-white/[0.06] border border-white/[0.09] p-0.5 w-full">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-md bg-brand-600/80 border border-brand-500/50 shadow-sm"
        animate={{ left: active === 0 ? '2px' : '50%', width: 'calc(50% - 2px)' }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      />
      {variants.map((v, i) => (
        <button key={v.label} onClick={() => onChange(i)}
          className={cn('relative z-10 flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors duration-200',
            active === i ? 'text-white' : 'text-dark-400 hover:text-dark-200')}>
          {v.label}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   QTY STEPPER
══════════════════════════════════════════════════════════════════ */
function QtyInput({ value, onChange, min, step = 50 }: {
  value: number; onChange: (v: number) => void; min: number; step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - step))}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Minus className="w-3 h-3 text-dark-300" />
      </button>
      <input
        type="number" value={value} min={min} step={step}
        onChange={e => onChange(Math.max(min, Number(e.target.value)))}
        className="w-20 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white font-semibold focus:outline-none focus:border-brand-500/50"
      />
      <button onClick={() => onChange(value + step)}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Plus className="w-3 h-3 text-dark-300" />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   GROUPED BAG CARD (kraft, duplex, takeaway)
══════════════════════════════════════════════════════════════════ */
function GroupedCard({ product }: { product: GroupedProduct }) {
  const [activeVariant, setActiveVariant] = useState(0);
  const [qty,       setQty]       = useState(product.minOrder);
  const [ropeColor, setRopeColor] = useState('natural');
  const [logoSides, setLogoSides] = useState<'1-side' | '2-sides'>('1-side');
  const [showWA,    setShowWA]    = useState(false);

  const v          = product.variants[activeVariant];
  const isLogo     = activeVariant === 0;
  const surcharge  = isLogo && logoSides === '2-sides' ? LOGO_SURCHARGE : 0;
  const unitPrice  = v.price + surcharge;
  const total      = unitPrice * qty;
  const ropeLabel  = ROPE_COLORS.find(c => c.value === ropeColor)?.label ?? 'Natural Kraft';
  const discount   = qty >= 500;

  const imageSrc = img(`${product.imageStem}-${isLogo ? 'logo' : 'plain'}.png`);

  const waMessage = [
    `🛍️ *Order — Craftpack Solution*`,
    ``,
    `*Product:* ${product.name}`,
    `*Type:* ${v.label}${isLogo ? ` (${logoSides === '2-sides' ? '2 Sides' : '1 Side'})` : ''}`,
    `*Rope Color:* ${ropeLabel}`,
    `*Quantity:* ${qty.toLocaleString()} pcs`,
    `*Unit Price:* ETB ${unitPrice}${surcharge > 0 ? ` (ETB ${v.price} + ETB ${surcharge} 2-side logo)` : ''}`,
    `*Total:* ETB ${total.toLocaleString()}`,
    discount ? `*Discount:* Bulk discount applied (500+ pcs)` : ``,
    ``,
    `📦 Min. order: ${product.minOrder} pcs | Discount above 500 pcs`,
    ``,
    `Please confirm availability and delivery time. Thank you! 🙏`,
  ].filter(l => l !== '').join('\n');

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card card-hover group flex flex-col">

        {/* Product image — switches with variant toggle */}
        <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc}
              alt={`${product.name} — ${v.label}`}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {product.isBestseller && (
            <span className="absolute top-2 left-2 badge bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs z-10">
              <Star className="w-2.5 h-2.5 fill-current" /> Best
            </span>
          )}
          {product.isEco && (
            <span className="absolute top-2 right-2 badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs z-10">
              <Leaf className="w-2.5 h-2.5" /> Eco
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Name */}
          <div>
            <p className="text-2xs text-dark-500 uppercase tracking-wider mb-0.5">
              {product.category === 'kraft_bags' ? 'Kraft Paper Bag' : product.category === 'duplex_bags' ? 'White Duplex Bag' : 'Take Away Bag'}
            </p>
            <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors leading-snug">{product.name}</h3>
            <p className="text-xs text-dark-500 mt-0.5 line-clamp-1">{product.desc}</p>
          </div>

          {/* Variant toggle — swaps image too */}
          <VariantToggle variants={product.variants} active={activeVariant} onChange={(i) => { setActiveVariant(i); if (i === 1) setLogoSides('1-side'); }} />

          {/* ── ORDER WIDGET ── */}
          <div className="space-y-2.5 pt-1 border-t border-white/5">
            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Quantity</span>
              <QtyInput value={qty} onChange={setQty} min={product.minOrder} step={50} />
            </div>

            {/* Rope color */}
            <div>
              <span className="text-xs text-dark-400 block mb-1.5">Rope Colour</span>
              <div className="flex flex-wrap gap-1.5">
                {ROPE_COLORS.map(c => (
                  <button key={c.value} onClick={() => setRopeColor(c.value)} title={c.label}
                    className={cn('w-6 h-6 rounded-full border-2 transition-all relative', ropeColor === c.value ? 'border-brand-400 scale-110' : 'border-transparent hover:border-white/30')}
                    style={{ backgroundColor: c.hex }}>
                    {ropeColor === c.value && <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow" />}
                  </button>
                ))}
              </div>
              <p className="text-2xs text-dark-500 mt-1">{ROPE_COLORS.find(c => c.value === ropeColor)?.label}</p>
            </div>

            {/* Logo sides — only when With Logo is active */}
            {isLogo && (
              <div>
                <span className="text-xs text-dark-400 block mb-1.5">Logo Print</span>
                <div className="flex gap-2">
                  {(['1-side', '2-sides'] as const).map(side => (
                    <button key={side} onClick={() => setLogoSides(side)}
                      className={cn('flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all',
                        logoSides === side
                          ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                          : 'bg-white/5 border-white/10 text-dark-400 hover:bg-white/10')}>
                      {side === '1-side' ? '1 Side' : `2 Sides +${LOGO_SURCHARGE} ETB`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-xs text-dark-400">
                <span>Unit price</span>
                <span className="text-dark-200">ETB {unitPrice}{surcharge > 0 && <span className="text-brand-400"> (+{surcharge} 2-side)</span>}</span>
              </div>
              <div className="flex justify-between text-xs text-dark-400">
                <span>Quantity</span>
                <span className="text-dark-200">{qty.toLocaleString()} pcs</span>
              </div>
              {discount && (
                <div className="flex justify-between text-xs text-brand-400">
                  <span>Bulk discount</span><span>Applied ✓</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
                <span className="text-white">Total</span>
                <motion.span key={total} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-brand-300">ETB {total.toLocaleString()}</motion.span>
              </div>
            </div>

            {qty < 500 && (
              <p className="text-2xs text-dark-500 text-center">Min. {product.minOrder} pcs · Discount available for 500+ pcs</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button onClick={() => toast.success('Added to cart!', { icon: '🛍️' })}
                className="btn-secondary flex-1 text-xs py-2.5 gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
              <button onClick={() => setShowWA(true)}
                className="flex-1 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 bg-green-600/20 border border-green-500/35 text-green-300 hover:bg-green-600/30 hover:border-green-500/60 transition-all">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="text-xs font-medium text-white">{product.rating}</span>
            <span className="text-xs text-dark-500">({product.reviews})</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWA && <WhatsAppModal message={waMessage} onClose={() => setShowWA(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   SINGLE BOX / RAW MATERIAL CARD
══════════════════════════════════════════════════════════════════ */
function SingleCard({ product }: { product: SingleProduct }) {
  const [qty,    setQty]    = useState(product.minOrder || 1);
  const [showWA, setShowWA] = useState(false);

  const isContact = product.basePrice === 0;
  const total     = isContact ? 0 : product.basePrice * qty;

  const waMessage = [
    `${product.category === 'cake_boxes' ? '🎂' : '🔧'} *Order — Craftpack Solution*`,
    ``,
    `*Product:* ${product.name}`,
    product.minOrder > 1
      ? `*Quantity:* ${qty.toLocaleString()} ${product.minOrder === 1 ? 'unit' : 'pcs'}`
      : `*Quantity:* ${qty} unit(s)`,
    !isContact ? `*Unit Price:* ETB ${product.basePrice}` : '',
    !isContact ? `*Total:* ETB ${total.toLocaleString()}` : '',
    ``,
    product.minOrder >= 500 ? `📦 Min. order: ${product.minOrder} pcs` : product.minOrder > 1 ? `📦 Min. order: ${product.minOrder} pcs` : '',
    ``,
    `Please confirm availability and delivery. Thank you! 🙏`,
  ].filter(Boolean).join('\n');

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card card-hover group flex flex-col">

        {/* Image — real photo for boxes, gradient placeholder for tools */}
        <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-700">
              <div className="w-20 h-20 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${product.color}50, ${product.color}20)`, border: `1px solid ${product.color}40` }}>
                <Package className="w-8 h-8 opacity-40" style={{ color: product.color }} />
              </div>
            </div>
          )}

          {product.isBestseller && (
            <span className="absolute top-2 left-2 badge bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs z-10">
              <Star className="w-2.5 h-2.5 fill-current" /> Best
            </span>
          )}
          <span className="absolute top-2 right-2 badge bg-white/5 text-dark-400 border border-white/8 text-xs z-10">
            <Tag className="w-2.5 h-2.5" /> {product.tag}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-2xs text-dark-500 uppercase tracking-wider mb-0.5">{product.category.replace(/_/g, ' ')}</p>
            <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors leading-snug">{product.name}</h3>
            <p className="text-xs text-dark-500 mt-0.5 line-clamp-2">{product.desc}</p>
          </div>

          {/* Order widget */}
          <div className="space-y-2.5 pt-1 border-t border-white/5 flex-1 flex flex-col justify-end">
            {product.minOrder > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-400">Quantity</span>
                <QtyInput value={qty} onChange={setQty} min={product.minOrder || 1} step={product.minOrder >= 500 ? 100 : product.minOrder > 1 ? 50 : 1} />
              </div>
            )}

            {!isContact && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-xs text-dark-400">
                  <span>Unit price</span><span className="text-dark-200">ETB {product.basePrice}</span>
                </div>
                <div className="flex justify-between text-xs text-dark-400">
                  <span>Quantity</span><span className="text-dark-200">{qty.toLocaleString()} pcs</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <motion.span key={total} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-gold-300">ETB {total.toLocaleString()}</motion.span>
                </div>
              </div>
            )}

            {isContact && (
              <div className="bg-dark-800/60 border border-white/8 rounded-xl p-3 text-center">
                <p className="text-xs text-dark-400">Price on request</p>
                <p className="text-sm font-semibold text-white mt-0.5">Contact us for pricing</p>
              </div>
            )}

            {product.minOrder >= 500 && (
              <p className="text-2xs text-dark-500 text-center">Min. {product.minOrder} pcs per order</p>
            )}

            <div className="flex gap-2">
              {!isContact && (
                <button onClick={() => toast.success('Added to cart!', { icon: '🛒' })}
                  className="btn-secondary flex-1 text-xs py-2.5 gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
              )}
              <button onClick={() => setShowWA(true)}
                className={cn(
                  'flex-1 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5',
                  'bg-green-600/20 border border-green-500/35 text-green-300 hover:bg-green-600/30 hover:border-green-500/60 transition-all',
                )}>
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="text-xs font-medium text-white">{product.rating}</span>
            <span className="text-xs text-dark-500">({product.reviews})</span>
            {product.isEco && <span className="ml-auto text-xs flex items-center gap-1 text-emerald-400"><Leaf className="w-3 h-3" /> Eco</span>}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWA && <WhatsAppModal message={waMessage} onClose={() => setShowWA(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   SILKSCREEN FRAME CARD (A5 / A4 / A3 size selector)
══════════════════════════════════════════════════════════════════ */
function SilkscreenFrameCard() {
  const [selectedSize, setSelectedSize] = useState(1); // default A4
  const [qty,    setQty]    = useState(1);
  const [showWA, setShowWA] = useState(false);

  const size  = FRAME_SIZES[selectedSize];
  const total = size.price * qty;

  const waMessage = [
    `🖼️ *Order — Craftpack Solution*`,
    ``,
    `*Product:* Silkscreen Frame`,
    `*Size:* ${size.label}`,
    `*Quantity:* ${qty} unit(s)`,
    `*Unit Price:* ETB ${size.price.toLocaleString()}`,
    `*Total:* ETB ${total.toLocaleString()}`,
    ``,
    `Please confirm availability and delivery. Thank you! 🙏`,
  ].join('\n');

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card card-hover group flex flex-col">

        <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-700">
            <div className="w-20 h-20 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #94a3b850, #94a3b820)', border: '1px solid #94a3b840' }}>
              <Package className="w-8 h-8 opacity-40" style={{ color: '#94a3b8' }} />
            </div>
          </div>
          <span className="absolute top-2 right-2 badge bg-white/5 text-dark-400 border border-white/8 text-xs z-10">
            <Tag className="w-2.5 h-2.5" /> Frame
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-2xs text-dark-500 uppercase tracking-wider mb-0.5">raw materials</p>
            <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors leading-snug">Silkscreen Frame</h3>
            <p className="text-xs text-dark-500 mt-0.5 line-clamp-2">Professional aluminium silkscreen frame. Available in A5, A4, and A3 sizes.</p>
          </div>

          {/* Size selector */}
          <div>
            <span className="text-xs text-dark-400 block mb-1.5">Size</span>
            <div className="grid grid-cols-3 gap-1.5">
              {FRAME_SIZES.map((s, i) => (
                <button key={s.label} onClick={() => setSelectedSize(i)}
                  className={cn('py-2 px-1 rounded-lg text-center transition-all border',
                    selectedSize === i
                      ? 'bg-brand-600/25 border-brand-500/50 text-brand-300'
                      : 'bg-white/4 border-white/8 text-dark-400 hover:bg-white/8')}>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-2xs opacity-70">ETB {s.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Order widget */}
          <div className="space-y-2.5 pt-1 border-t border-white/5 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Quantity</span>
              <QtyInput value={qty} onChange={setQty} min={1} step={1} />
            </div>

            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-xs text-dark-400">
                <span>Size</span><span className="text-dark-200">{size.label}</span>
              </div>
              <div className="flex justify-between text-xs text-dark-400">
                <span>Unit price</span><span className="text-dark-200">ETB {size.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-dark-400">
                <span>Quantity</span><span className="text-dark-200">{qty} unit(s)</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
                <span className="text-white">Total</span>
                <motion.span key={total} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-gold-300">ETB {total.toLocaleString()}</motion.span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => toast.success('Added to cart!', { icon: '🛒' })}
                className="btn-secondary flex-1 text-xs py-2.5 gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
              <button onClick={() => setShowWA(true)}
                className="flex-1 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 bg-green-600/20 border border-green-500/35 text-green-300 hover:bg-green-600/30 hover:border-green-500/60 transition-all">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="text-xs font-medium text-white">4.8</span>
            <span className="text-xs text-dark-500">(56)</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWA && <WhatsAppModal message={waMessage} onClose={() => setShowWA(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   KRAFT PAPER ROLL CARD
══════════════════════════════════════════════════════════════════ */
type RollOrderType = 'rim' | 'kg' | 'roll';

function KraftRollCard({ roll }: { roll: KraftRoll }) {
  const [orderType, setOrderType] = useState<RollOrderType>('rim');
  const [qty,       setQty]       = useState(1);
  const [showWA,    setShowWA]    = useState(false);

  const priceInfo = useMemo(() => {
    if (orderType === 'rim') {
      const isBulk    = qty >= 5;
      const unitPrice = isBulk ? roll.rimBulkPrice : roll.rimPrice;
      return { unitPrice, total: unitPrice * qty, unit: 'rim (100 pcs)', isBulk, freeDelivery: false, valid: true };
    }
    if (orderType === 'kg') {
      if (qty < roll.kgMin) return { valid: false, msg: `Minimum ${roll.kgMin}kg for per-kg pricing.` };
      return { unitPrice: roll.kgPrice, total: roll.kgPrice * qty, unit: 'kg', isBulk: false, freeDelivery: false, valid: true };
    }
    if (qty < roll.rollMin) return { valid: false, msg: `Roll orders start from ${roll.rollMin}kg (with free delivery).` };
    return { unitPrice: roll.rollPrice, total: roll.rollPrice * qty, unit: 'kg', isBulk: false, freeDelivery: true, valid: true };
  }, [orderType, qty, roll]);

  const minForType = orderType === 'rim' ? 1 : orderType === 'kg' ? roll.kgMin : roll.rollMin;

  const waMessage = [
    `📜 *Roll Order — Craftpack Solution*`,
    ``,
    `*Product:* ${roll.name}`,
    `*Size:* ${roll.size}`,
    `*Order Type:* ${orderType === 'rim' ? `Per Rim (100 pcs each)` : orderType === 'kg' ? 'Per KG' : 'Roll Order (500kg+)'}`,
    `*Quantity:* ${qty.toLocaleString()} ${orderType === 'rim' ? 'rims' : 'kg'}`,
    priceInfo.valid ? `*Unit Price:* ETB ${(priceInfo as { unitPrice: number }).unitPrice}/${orderType === 'rim' ? 'rim' : 'kg'}` : '',
    priceInfo.valid ? `*Total:* ETB ${(priceInfo as { total: number }).total.toLocaleString()}` : '',
    (priceInfo as { freeDelivery?: boolean }).freeDelivery ? `🚚 *Free Delivery included*` : '',
    (priceInfo as { isBulk?: boolean }).isBulk ? `💰 *Bulk rate applied (5+ rims)*` : '',
    ``,
    `Please confirm availability and delivery details. Thank you! 🙏`,
  ].filter(Boolean).join('\n');

  const ORDER_TYPES: { value: RollOrderType; label: string; sub: string }[] = [
    { value: 'rim',  label: 'Per Rim',    sub: '100 pcs/rim' },
    { value: 'kg',   label: 'Per KG',     sub: `Min. ${roll.kgMin}kg` },
    { value: 'roll', label: 'Roll Order', sub: `${roll.rollMin}kg+ · Free delivery` },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card card-hover group flex flex-col col-span-1">

        {/* Real product image */}
        <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
          <Image
            src={img('kraft paper roll.png')}
            alt={roll.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 badge bg-red-500/25 text-red-300 border border-red-500/40 text-xs z-10">
            🔥 Big Discount
          </div>
          <div className="absolute top-2 right-2 badge bg-white/8 text-dark-300 border border-white/10 text-xs z-10">
            {roll.size}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-2xs text-dark-500 uppercase tracking-wider mb-0.5">Kraft Paper Roll</p>
            <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">{roll.name}</h3>
            <p className="text-xs text-dark-500 mt-0.5">Premium quality · Eco friendly · Strong &amp; durable</p>
          </div>

          {/* Pricing tiers */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-white/4 rounded-lg p-2 border border-white/6">
              <p className="text-2xs text-dark-500 mb-0.5">Per Rim (100pc)</p>
              <p className="text-xs font-bold text-white">ETB {roll.rimPrice.toLocaleString()}</p>
              <p className="text-2xs text-brand-400">5+ rims: {roll.rimBulkPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white/4 rounded-lg p-2 border border-white/6">
              <p className="text-2xs text-dark-500 mb-0.5">Per KG (40kg+)</p>
              <p className="text-xs font-bold text-white">ETB {roll.kgPrice}</p>
              <p className="text-2xs text-dark-500">min 40kg</p>
            </div>
            <div className="bg-amber-500/8 rounded-lg p-2 border border-amber-500/20">
              <p className="text-2xs text-amber-400/80 mb-0.5">Roll 500kg+</p>
              <p className="text-xs font-bold text-amber-300">ETB {roll.rollPrice}/kg</p>
              <p className="text-2xs text-green-400">Free delivery</p>
            </div>
          </div>

          {/* Order widget */}
          <div className="space-y-2.5 pt-1 border-t border-white/5 flex-1 flex flex-col justify-end">
            <div>
              <span className="text-xs text-dark-400 block mb-1.5">Order Type</span>
              <div className="grid grid-cols-3 gap-1">
                {ORDER_TYPES.map(t => (
                  <button key={t.value} onClick={() => { setOrderType(t.value); setQty(t.value === 'rim' ? 1 : t.value === 'kg' ? roll.kgMin : roll.rollMin); }}
                    className={cn('py-2 px-1 rounded-lg text-center transition-all border',
                      orderType === t.value
                        ? 'bg-brand-600/25 border-brand-500/50 text-brand-300'
                        : 'bg-white/4 border-white/8 text-dark-400 hover:bg-white/8')}>
                    <p className="text-xs font-semibold">{t.label}</p>
                    <p className="text-2xs opacity-70">{t.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">{orderType === 'rim' ? 'Rims' : 'Kilograms'}</span>
              <QtyInput value={qty} onChange={setQty} min={minForType} step={orderType === 'rim' ? 1 : orderType === 'kg' ? 5 : 50} />
            </div>

            {priceInfo.valid ? (
              <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-xs text-dark-400">
                  <span>Unit price</span>
                  <span className="text-dark-200">ETB {(priceInfo as { unitPrice: number }).unitPrice}/{orderType === 'rim' ? 'rim' : 'kg'}</span>
                </div>
                {(priceInfo as { isBulk?: boolean }).isBulk && (
                  <div className="flex justify-between text-xs text-brand-400"><span>Bulk rate (5+ rims)</span><span>Applied ✓</span></div>
                )}
                {(priceInfo as { freeDelivery?: boolean }).freeDelivery && (
                  <div className="flex justify-between text-xs text-green-400"><span>Delivery</span><span>Free 🚚</span></div>
                )}
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <motion.span key={(priceInfo as { total: number }).total} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-brand-300">ETB {(priceInfo as { total: number }).total.toLocaleString()}</motion.span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-400">{(priceInfo as { msg?: string }).msg}</p>
              </div>
            )}

            <button onClick={() => priceInfo.valid && setShowWA(true)} disabled={!priceInfo.valid}
              className={cn(
                'w-full text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all',
                priceInfo.valid
                  ? 'bg-green-600/20 border border-green-500/35 text-green-300 hover:bg-green-600/30 hover:border-green-500/60'
                  : 'bg-white/5 border border-white/8 text-dark-500 cursor-not-allowed',
              )}>
              <MessageCircle className="w-3.5 h-3.5" /> Order via WhatsApp
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWA && <WhatsAppModal message={waMessage} onClose={() => setShowWA(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════════════════════════════ */
function SectionHeader({ icon: Icon, label, desc }: {
  icon: React.ElementType; label: string; desc?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-400" /> {label}
      </h2>
      {desc && <p className="text-xs text-dark-500 mt-1">{desc}</p>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN CATALOG
══════════════════════════════════════════════════════════════════ */
type DisplayItem =
  | { type: 'grouped';  data: GroupedProduct }
  | { type: 'single';   data: SingleProduct }
  | { type: 'roll';     data: KraftRoll };

type ViewMode = 'grid' | 'list';
type SortOpt  = 'featured' | 'price_asc' | 'price_desc' | 'rating';

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [sortBy,         setSortBy]         = useState<SortOpt>('featured');
  const [ecoOnly,        setEcoOnly]        = useState(false);

  const displayItems = useMemo((): DisplayItem[] => {
    const q = searchQuery.toLowerCase().trim();

    const grouped: DisplayItem[] = GROUPED
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !ecoOnly || p.isEco)
      .map(p => ({ type: 'grouped' as const, data: p }));

    const singles: DisplayItem[] = SINGLES
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !ecoOnly || p.isEco)
      .map(p => ({ type: 'single' as const, data: p }));

    const rolls: DisplayItem[] = (activeCategory === 'all' || activeCategory === 'raw_materials')
      ? KRAFT_ROLLS
          .filter(r => !q || r.name.toLowerCase().includes(q))
          .map(r => ({ type: 'roll' as const, data: r }))
      : [];

    return [...grouped, ...rolls, ...singles];
  }, [activeCategory, searchQuery, ecoOnly]);

  /* filtered sub-lists for each section */
  const kraftBags    = displayItems.filter(i => i.type === 'grouped' && (i.data as GroupedProduct).category === 'kraft_bags');
  const duplexBags   = displayItems.filter(i => i.type === 'grouped' && (i.data as GroupedProduct).category === 'duplex_bags');
  const takeawayBags = displayItems.filter(i => i.type === 'grouped' && (i.data as GroupedProduct).category === 'takeaway_bags');
  const rollItems    = displayItems.filter(i => i.type === 'roll');
  const boxItems     = displayItems.filter(i => i.type === 'single' && i.data.category === 'cake_boxes');
  const rawItems     = displayItems.filter(i => i.type === 'single' && i.data.category === 'raw_materials');

  const showBagHint = activeCategory === 'all' || activeCategory === 'kraft_bags' || activeCategory === 'duplex_bags' || activeCategory === 'takeaway_bags';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
          <div className="w-8 h-px bg-brand-400" /> Product Catalog
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
          Premium Packaging <span className="gradient-text">Solutions</span>
        </h1>
        <p className="text-dark-300 text-lg max-w-2xl">
          Enter your quantity to see the price instantly, then order directly via WhatsApp.
          Min. 200 pcs for bags · Min. 500 pcs for boxes.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block flex-shrink-0 w-56 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                    activeCategory === cat.id
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                      : 'text-dark-400 hover:text-white hover:bg-white/5')}>
                  <span>{cat.label}</span>
                  <span className={cn('text-xs', activeCategory === cat.id ? 'text-brand-400' : 'text-dark-600')}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Eco-Friendly</h3>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div onClick={() => setEcoOnly(!ecoOnly)}
                className={cn('w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer', ecoOnly ? 'bg-emerald-600' : 'bg-dark-700')}>
                <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', ecoOnly ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
              <span className="text-sm text-dark-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Eco Only
              </span>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-green-500/8 border border-green-500/20 space-y-2">
            <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> Quick Order
            </p>
            {WA_PHONES.map(p => (
              <a key={p.wa} href={`https://wa.me/${p.wa}`} target="_blank" rel="noopener noreferrer"
                className="block text-xs text-green-300/80 hover:text-green-300 transition-colors">
                {p.label}
              </a>
            ))}
          </div>

          <button onClick={() => { setActiveCategory('all'); setEcoOnly(false); setSearchQuery(''); }}
            className="text-xs text-dark-500 hover:text-white transition-colors flex items-center gap-1">
            <X className="w-3 h-3" /> Reset Filters
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} className="input-field pl-9 py-2.5 text-sm" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-dark-400 hover:text-white" />
                </button>
              )}
            </div>

            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOpt)}
                className="input-field pr-8 py-2.5 text-sm appearance-none cursor-pointer min-w-36">
                <option value="featured">Featured</option>
                <option value="rating">Best Rated</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            </div>

            <div className="flex gap-1 p-1 rounded-xl bg-dark-800 border border-white/5">
              {(['grid', 'list'] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={cn('p-2 rounded-lg transition-colors', viewMode === m ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white')}>
                  {m === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <span className="text-sm text-dark-400 ml-auto">{displayItems.length} products</span>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeCategory === cat.id ? 'bg-brand-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white')}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toggle hint banner */}
          {showBagHint && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/8 border border-brand-500/20 text-xs text-brand-300">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center font-bold flex-shrink-0">↔</span>
              Toggle <strong className="text-brand-200">With Logo</strong> / <strong className="text-brand-200">Plain</strong> to see real photos and prices.
              Logo on <strong className="text-brand-200">2 sides</strong> adds ETB {LOGO_SURCHARGE}/bag.
            </motion.div>
          )}

          {/* ── Sections ── */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + searchQuery + sortBy}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="space-y-10">

              {/* Kraft Paper Bags */}
              {kraftBags.length > 0 && (
                <div>
                  {activeCategory === 'all' && <SectionHeader icon={Package} label="Kraft Paper Bags" desc="Eco-friendly, durable. Min. 200 pcs per order." />}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {kraftBags.map(item => <GroupedCard key={(item.data as GroupedProduct).id} product={item.data as GroupedProduct} />)}
                  </div>
                </div>
              )}

              {/* White Duplex Bags */}
              {duplexBags.length > 0 && (
                <div>
                  {(activeCategory === 'all' || activeCategory === 'duplex_bags') && <SectionHeader icon={Package} label="White Duplex Bags" desc="Premium white finish for boutiques, fashion and gifting. Min. 200 pcs." />}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {duplexBags.map(item => <GroupedCard key={(item.data as GroupedProduct).id} product={item.data as GroupedProduct} />)}
                  </div>
                </div>
              )}

              {/* Take Away Bags */}
              {takeawayBags.length > 0 && (
                <div>
                  {(activeCategory === 'all' || activeCategory === 'takeaway_bags') && (
                    <SectionHeader icon={UtensilsCrossed} label="Take Away Bags" desc="Flat-bottom kraft bags designed for restaurants, cafes and food delivery. Min. 200 pcs." />
                  )}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {takeawayBags.map(item => <GroupedCard key={(item.data as GroupedProduct).id} product={item.data as GroupedProduct} />)}
                  </div>
                </div>
              )}

              {/* Kraft Paper Rolls */}
              {rollItems.length > 0 && activeCategory !== 'cake_boxes' && (
                <div>
                  {(activeCategory === 'all' || activeCategory === 'raw_materials') && <SectionHeader icon={Layers} label="Kraft Paper Rolls" desc="Raw material for bag production. Tiered pricing: per rim, per kg, or roll order." />}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {rollItems.map(item => <KraftRollCard key={(item.data as KraftRoll).id} roll={item.data as KraftRoll} />)}
                  </div>
                </div>
              )}

              {/* Cake & Cookies Boxes */}
              {boxItems.length > 0 && (
                <div>
                  {(activeCategory === 'all' || activeCategory === 'cake_boxes') && <SectionHeader icon={Package} label="Cake & Cookies Boxes" desc="Rigid food-grade boxes. Min. 500 pcs per order." />}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {boxItems.map(item => <SingleCard key={(item.data as SingleProduct).id} product={item.data as SingleProduct} />)}
                  </div>
                </div>
              )}

              {/* Printing Supplies */}
              {(rawItems.length > 0 || activeCategory === 'all' || activeCategory === 'raw_materials') && (
                <div>
                  {(activeCategory === 'all' || activeCategory === 'raw_materials') && <SectionHeader icon={Tag} label="Printing Supplies" desc="Silkscreen tools, inks and equipment for bag printing." />}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {/* Silkscreen Frame — inline size selector (A5 / A4 / A3) */}
                    {(activeCategory === 'all' || activeCategory === 'raw_materials') &&
                      (!searchQuery || 'silkscreen frame'.includes(searchQuery.toLowerCase())) && (
                      <SilkscreenFrameCard />
                    )}
                    {rawItems.map(item => <SingleCard key={(item.data as SingleProduct).id} product={item.data as SingleProduct} />)}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {displayItems.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-white font-medium">No products found</p>
              <p className="text-dark-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
