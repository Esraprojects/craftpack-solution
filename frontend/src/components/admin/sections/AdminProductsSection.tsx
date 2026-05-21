'use client';
import AdminSectionShell from './AdminSectionShell';
import { Package } from 'lucide-react';
export default function AdminProductsSection() {
  return <AdminSectionShell icon={Package} title="Products Management" description="Manage your product catalogue and variants" color="text-emerald-400" />;
}
