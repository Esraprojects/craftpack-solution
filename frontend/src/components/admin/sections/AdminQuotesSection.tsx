'use client';
import AdminSectionShell from './AdminSectionShell';
import { FileText } from 'lucide-react';
export default function AdminQuotesSection() {
  return <AdminSectionShell icon={FileText} title="Quote Requests" description="Review and respond to customer quote requests" color="text-cyan-400" />;
}
