'use client';
import AdminSectionShell from './AdminSectionShell';
import { BarChart2 } from 'lucide-react';
export default function AdminAnalyticsSection() {
  return <AdminSectionShell icon={BarChart2} title="Analytics" description="Revenue trends, order analytics, and customer insights" color="text-gold-400" />;
}
