'use client';
import AdminSectionShell from './AdminSectionShell';
import { Activity } from 'lucide-react';
export default function AdminActivitySection() {
  return <AdminSectionShell icon={Activity} title="Activity Logs" description="Audit trail of all system and user actions" color="text-orange-400" />;
}
