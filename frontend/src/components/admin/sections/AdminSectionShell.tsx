'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

export default function AdminSectionShell({ icon: Icon, title, description, color = 'text-brand-400' }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-display">{title}</h1>
          <p className="text-dark-400 text-sm mt-0.5">{description}</p>
        </div>
      </div>

      <div className="card p-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display">{title}</h2>
          <p className="text-dark-400 mt-2 max-w-md">
            This section is currently being set up. Full management capabilities will be available soon.
            In the meantime, use the API or contact your system administrator.
          </p>
        </div>
        <Link href="/admin" className="btn-secondary mt-2">← Back to Overview</Link>
      </div>
    </div>
  );
}
