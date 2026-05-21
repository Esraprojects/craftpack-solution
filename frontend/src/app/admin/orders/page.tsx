import type { Metadata } from 'next';
import AdminOrdersSection from '@/components/admin/sections/AdminOrdersSection';

export const metadata: Metadata = { title: 'Orders — Admin | Craftpack Solution', robots: { index: false, follow: false } };

export default function AdminOrdersPage() {
  return <AdminOrdersSection />;
}
