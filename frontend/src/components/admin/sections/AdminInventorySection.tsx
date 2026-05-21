'use client';
import AdminSectionShell from './AdminSectionShell';
import { Database } from 'lucide-react';
export default function AdminInventorySection() {
  return <AdminSectionShell icon={Database} title="Inventory" description="Track raw materials, stock levels, and suppliers" color="text-amber-400" />;
}
