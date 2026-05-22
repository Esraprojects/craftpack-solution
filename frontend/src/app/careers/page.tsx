import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers — Craftpack Solution',
  description: 'Join Ethiopia\'s leading paper bag manufacturer. Explore open positions at Craftpack Solution.',
};

const openings = [
  { title: 'Production Supervisor',  dept: 'Manufacturing', location: 'Gofa Camp, Addis Ababa',    type: 'Full-time', desc: 'Oversee daily production operations and ensure quality standards are met.' },
  { title: 'Graphic Designer',        dept: 'Creative',      location: 'Gurdshola, Addis Ababa',   type: 'Full-time', desc: 'Create packaging designs and print-ready artwork for client orders.' },
  { title: 'Sales Executive',         dept: 'Sales',         location: 'Addis Ababa',              type: 'Full-time', desc: 'Grow our B2B client base across hospitality, retail, and food sectors.' },
  { title: 'Warehouse Coordinator',   dept: 'Logistics',     location: 'Gofa Camp, Addis Ababa',    type: 'Full-time', desc: 'Manage inventory, dispatch, and logistics coordination.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4">Join Our Team</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Build Ethiopia's Packaging Future
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            We're a fast-growing, proud Ethiopian manufacturer. If you're passionate about quality,
            creativity, and sustainability — we'd love to hear from you.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">Open Positions</h2>
          {openings.map(job => (
            <div key={job.title} className="card card-hover p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">{job.title}</h3>
                  <span className="badge-brand">{job.dept}</span>
                  <span className="badge-neutral">{job.type}</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{job.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="w-3 h-3" />{job.location}
                </div>
              </div>
              <a href="mailto:info@craftpacksolution.com?subject=Application: {job.title}"
                className="btn-primary flex-shrink-0 text-sm px-5 py-2.5">
                Apply <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center space-y-4">
          <Briefcase className="w-10 h-10 text-brand-500 mx-auto" />
          <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Don't see a match?</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Send your CV to us and we'll reach out when a suitable role opens.</p>
          <a href="mailto:info@craftpacksolution.com?subject=General Application" className="btn-secondary mx-auto">
            Send CV
          </a>
        </div>
      </div>
    </div>
  );
}
