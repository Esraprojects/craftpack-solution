'use client';
import AdminSectionShell from './AdminSectionShell';
import { BookOpen } from 'lucide-react';
export default function AdminBlogSection() {
  return <AdminSectionShell icon={BookOpen} title="Blog Management" description="Create and manage blog posts and content" color="text-pink-400" />;
}
