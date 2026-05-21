'use client';
import AdminSectionShell from './AdminSectionShell';
import { MessageSquare } from 'lucide-react';
export default function AdminInquiriesSection() {
  return <AdminSectionShell icon={MessageSquare} title="Contact Inquiries" description="View and respond to contact form submissions" color="text-teal-400" />;
}
