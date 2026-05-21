'use client';
import AdminSectionShell from './AdminSectionShell';
import { ShoppingCart } from 'lucide-react';
export default function AdminOrdersSection() {
  return <AdminSectionShell icon={ShoppingCart} title="Orders Management" description="View and manage all customer orders" color="text-brand-400" />;
}
