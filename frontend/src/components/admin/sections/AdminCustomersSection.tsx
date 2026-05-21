'use client';
import AdminSectionShell from './AdminSectionShell';
import { Users } from 'lucide-react';
export default function AdminCustomersSection() {
  return <AdminSectionShell icon={Users} title="Customers" description="View and manage your customer database" color="text-violet-400" />;
}
