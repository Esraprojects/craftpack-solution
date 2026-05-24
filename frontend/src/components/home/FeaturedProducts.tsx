'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const img = (name: string) => `/images/${name.replace(/ /g, '%20')}`;

/* ── Bag products shown with toggle (grouped by size) ── */
const BAG_FEATURED = [
  {
    id:'kf-m', name:'Kraft Paper Bag — Medium', category:'Kraft Paper Bag',
    imageStem:'kraft-bag-medium',
    isEco:true, isBestseller:true, rating:4.9, reviews:186, minOrder:200,
    desc:'Most popular. Perfect for cafes, retail and boutique shops.',
    variants:[{label:'With Logo',price:45,slug:'kraft-bag-medium-logo'},{label:'Plain',price:32,slug:'kraft-bag-medium-plain'}],
  },
  {
    id:'df-m', name:'White Duplex Bag — Medium', category:'White Duplex Bag',
    imageStem:'white duplex-bag-medium',
    isEco:false, isBestseller:true, rating:4.9, reviews:148, minOrder:200,
    desc:'Premium white finish. Ideal for fashion and high-end retail.',
    variants:[{label:'With Logo',price:53,slug:'duplex-bag-medium-logo'},{label:'Plain',price:43,slug:'duplex-bag-medium-plain'}],
  },
  {
    id:'kf-s', name:'Kraft Paper Bag — Small', category:'Kraft Paper Bag',
    imageStem:'kraft-bag-small',
    isEco:true, isBestseller:true, rating:4.9, reviews:214, minOrder:200,
    desc:'Best for cafes, juice bars and small boutique retail.',
    variants:[{label:'With Logo',price:39,slug:'kraft-bag-small-logo'},{label:'Plain',price:29,slug:'kraft-bag-small-plain'}],
  },
];

/* ── Box products (single cards) ── */
const BOX_FEATURED = [
  {
    id:'bf-7', name:'½kg Cake Box (with Logo)', category:'Cake & Cookies Box',
    image: img('half kg cake box-logo.png'),
    isEco:false, isBestseller:true, rating:4.9, reviews:221, minOrder:500, basePrice:45,
    slug:'cake-box-half-logo', desc:'Most popular. Mini cakes, pastry slices and take-away.',
  },
  {
    id:'bf-2', name:'1kg Cake Box (Window + Logo)', category:'Cake & Cookies Box',
    image: img('1kg cake box-window-logo.png'),
    isEco:false, isBestseller:true, rating:5.0, reviews:178, minOrder:500, basePrice:70,
    slug:'cake-box-1kg-window-logo', desc:'PVC window display box. Premium gifting and patisseries.',
  },
  {
    id:'bf-3', name:'2kg Cake Box (with Logo)', category:'Cake & Cookies Box',
    image: img('2kg cake box-logo.png'),
    isEco:false, isBestseller:false, rating:4.8, reviews:134, minOrder:500, basePrice:80,
    slug:'cake-box-2kg-logo', desc:'Large format for wedding cakes and catering orders.',
  },
];

/* ── Variant slide toggle ── */
function VariantToggle({ variants, active, onChange }: { variants:{label:string}[]; active:number; onChange:(i:number)=>void }) {
  return (
    <div className="relative flex rounded-lg bg-white/[0.06] border border-white/[0.09] p-0.5 w-full">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-md bg-brand-600/80 border border-brand-500/50"
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

/* ── Bag card — image swaps with variant toggle ── */
function BagCard({ product, index }: { product: typeof BAG_FEATURED[0]; index: number }) {
  const [active, setActive] = useState(0);
  const v = product.variants[active];
  const imageSrc = img(`${product.imageStem}-${active === 0 ? 'logo' : 'plain'}.png`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card card-hover group"
    >
      {/* Real product image */}
      <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
        <motion.div key={imageSrc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={`${product.name} — ${v.label}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && <span className="badge bg-gold-500/20 text-gold-300 border border-gold-500/30"><Star className="w-2.5 h-2.5 fill-current" /> Bestseller</span>}
          {product.isEco && <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><Leaf className="w-2.5 h-2.5" /> Eco</span>}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button className="w-full btn-primary text-xs py-2 gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Quick Add</button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <div className="text-xs text-dark-500 mb-1">{product.category}</div>
          <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-brand-300 transition-colors">{product.name}</h3>
          <p className="text-xs text-dark-400 mt-1 line-clamp-1">{product.desc}</p>
        </div>
        <VariantToggle variants={product.variants} active={active} onChange={setActive} />
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div>
            <div className="text-xs text-dark-500">per piece</div>
            <motion.div key={v.price} initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.15 }}
              className="text-base font-bold text-white">ETB {v.price}</motion.div>
            <div className="text-2xs text-dark-500">min. {product.minOrder} pcs</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-dark-400">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="font-medium text-white">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
        </div>
        <Link href={`/products/${v.slug}`} className="flex items-center justify-between text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors group/link">
          View Details <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Box card ── */
function BoxCard({ product, index }: { product: typeof BOX_FEATURED[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card card-hover group"
    >
      {/* Real product image */}
      <div className="relative h-52 rounded-t-2xl overflow-hidden bg-dark-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.isBestseller && (
          <span className="absolute top-3 left-3 badge bg-gold-500/20 text-gold-300 border border-gold-500/30 z-10">
            <Star className="w-2.5 h-2.5 fill-current" /> Bestseller
          </span>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <div className="text-xs text-dark-500 mb-1">{product.category}</div>
          <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-brand-300 transition-colors">{product.name}</h3>
          <p className="text-xs text-dark-400 mt-1 line-clamp-2">{product.desc}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <div className="text-xs text-dark-500">per piece</div>
            <div className="text-base font-bold text-white">ETB {product.basePrice}</div>
            <div className="text-2xs text-dark-500">min. {product.minOrder} pcs</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-dark-400">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="font-medium text-white">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
        </div>
        <Link href={`/products/${product.slug}`} className="flex items-center justify-between text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors group/link">
          View Details <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
            <div className="w-8 h-px bg-brand-400" />
            Our Products
            <div className="w-8 h-px bg-brand-400" />
          </div>
          <h2 className="section-title">
            Packaging That <span className="gradient-text">Makes an Impression</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From everyday retail bags to luxury branded packaging — engineered for impact, built for scale.
          </p>
        </motion.div>

        {/* Hint */}
        <div className="flex items-center justify-center gap-2 mb-8 text-xs text-brand-400">
          <span className="w-5 h-5 rounded-full bg-brand-500/15 flex items-center justify-center font-bold">↔</span>
          Slide the toggle on bag cards to compare <strong>With Logo</strong> vs <strong>Plain</strong> pricing
        </div>

        {/* Bag cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {BAG_FEATURED.map((p, i) => <BagCard key={p.id} product={p} index={i} />)}
        </div>

        {/* Box cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BOX_FEATURED.map((p, i) => <BoxCard key={p.id} product={p} index={i} />)}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products" className="btn-primary text-base px-10 py-4 group">
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
