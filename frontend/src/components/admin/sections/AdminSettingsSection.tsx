'use client';
import AdminSectionShell from './AdminSectionShell';
import { Settings } from 'lucide-react';
export default function AdminSettingsSection() {
  return <AdminSectionShell icon={Settings} title="System Settings" description="Configure application settings, taxes, and preferences" color="text-slate-400" />;
}
