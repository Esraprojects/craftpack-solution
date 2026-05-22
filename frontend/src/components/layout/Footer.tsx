'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, MapPin, Phone, Mail, ExternalLink,
  Facebook, Instagram, Send,
  ArrowRight
} from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Paper Bags',       href: '/products?category=paper_bags' },
    { label: 'Shopping Bags',    href: '/products?category=shopping_bags' },
    { label: 'Luxury Packaging', href: '/products?category=luxury_bags' },
    { label: 'Food Packaging',   href: '/products?category=food_packaging' },
    { label: 'Eco-Friendly',     href: '/products?category=eco_friendly' },
    { label: 'Custom Printed',   href: '/products?category=custom_printed' },
  ],
  company: [
    { label: 'About Us',       href: '/about' },
    { label: 'Portfolio',      href: '/portfolio' },
    { label: 'Industries',     href: '/industries' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Blog',           href: '/blog' },
    { label: 'Careers',        href: '/careers' },
  ],
  support: [
    { label: 'FAQ',           href: '/faq' },
    { label: 'Contact Us',    href: '/contact' },
    { label: 'Get a Quote',   href: '/quote' },
    { label: 'Custom Orders', href: '/custom-order' },
    { label: 'Bulk Orders',   href: '/bulk-order' },
    { label: 'Track Order',   href: '/dashboard/orders' },
  ],
  legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/cookies' },
    { label: 'Refund Policy',    href: '/refund-policy' },
  ],
};

/* Custom TikTok SVG icon */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
    </svg>
  );
}

/* Custom Jiji icon */
function JijiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </svg>
  );
}

const socials = [
  { icon: Facebook,  href: 'https://www.facebook.com/craftpacksolution',  label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/craftpack_solution', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@craftpacksolution',   label: 'TikTok' },
  { icon: Send,      href: 'https://t.me/craftpacksolution',               label: 'Telegram' },
  { icon: JijiIcon,  href: 'https://jiji.com.et/shop/craftpacksolution',   label: 'Jiji Ethiopia' },
];

const certifications = [
  { name: 'ISO 9001:2015',  desc: 'Quality Management' },
  { name: 'FSC Certified',  desc: 'Responsible Forestry' },
  { name: 'ISO 14001',      desc: 'Environmental Mgmt' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950">
      {/* CTA Banner */}
      <div className="relative overflow-hidden bg-brand-900 dark:bg-dark-950">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/60 via-brand-900/40 to-brand-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                Ready to elevate your brand?
              </h2>
              <p className="text-brand-200 text-lg">
                Get a custom quote for your packaging needs in 24 hours.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/quote"   className="btn-gold">Request Quote <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-secondary dark:text-white">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-brand">
                <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">Craftpack</div>
                <div className="text-brand-400 text-xs font-medium tracking-widest uppercase leading-none mt-0.5">Solution</div>
              </div>
            </Link>

            <p className="text-dark-400 text-sm leading-relaxed max-w-xs">
              Ethiopia's premier paper bag and packaging manufacturer. We craft premium, eco-conscious packaging solutions for enterprises, retailers, and hospitality businesses.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-dark-400">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Gofa Camp &amp; Gurdshola, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-dark-400">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+251901236509" className="hover:text-white transition-colors">0901 236 509</a>
                  <a href="tel:+251957117787" className="hover:text-white transition-colors">0957 117 787</a>
                  <a href="tel:+251910628159" className="hover:text-white transition-colors">0910 628 159</a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-dark-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:info@craftpacksolution.com" className="hover:text-white transition-colors">info@craftpacksolution.com</a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-600/20 hover:text-brand-400 text-dark-400 flex items-center justify-center transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {([
            { title: 'Products',   links: footerLinks.products },
            { title: 'Company',    links: footerLinks.company },
            { title: 'Support',    links: footerLinks.support },
          ] as const).map(col => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Certified & Compliant</span>
            {certifications.map(cert => (
              <div
                key={cert.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-white/5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-dark-300 font-medium">{cert.name}</span>
                <span className="text-xs text-dark-500">·</span>
                <span className="text-xs text-dark-500">{cert.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dark-500">
              © {new Date().getFullYear()} Craftpack Solution. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map(link => (
                <Link key={link.href} href={link.href} className="text-xs text-dark-500 hover:text-dark-300 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
