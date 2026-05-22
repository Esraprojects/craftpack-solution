'use client';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import { motion }              from 'framer-motion';
import { Clock, ShieldOff, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuthStore }        from '@/store/useAuthStore';
import { useAdminAccessStore } from '@/store/useAdminAccessStore';
import AdminSidebar            from '@/components/admin/AdminSidebar';
import AdminHeader             from '@/components/admin/AdminHeader';

/* ──────────────────────────────────────────────────────────────
   Blocked screens
────────────────────────────────────────────────────────────── */
function BlockedScreen({
  icon: Icon, title, subtitle, action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-brand-900/30 border border-brand-800/40 flex items-center justify-center mx-auto">
          <Icon className="w-10 h-10 text-brand-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display mb-2">{title}</h2>
          <p className="text-dark-300 leading-relaxed">{subtitle}</p>
        </div>
        {action}
        <Link href="/" className="btn-secondary text-sm mx-auto w-fit">
          ← Back to Website
        </Link>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Request-access screen
────────────────────────────────────────────────────────────── */
function RequestAccessScreen({ userId, userName, userEmail }: { userId: string; userName: string; userEmail: string }) {
  const { requestAccess } = useAdminAccessStore();
  const [sent, setSent] = useState(false);

  function handleRequest() {
    requestAccess(userId, userName, userEmail);
    setSent(true);
  }

  if (sent) {
    return (
      <BlockedScreen
        icon={Clock}
        title="Request Sent"
        subtitle="Your access request has been sent to the owner. You will be notified once it is reviewed."
      />
    );
  }

  return (
    <BlockedScreen
      icon={Lock}
      title="Admin Access Required"
      subtitle="You need owner approval to access the admin panel. Click below to send an access request."
      action={
        <button onClick={handleRequest} className="btn-primary mx-auto">
          Request Access <ArrowRight className="w-4 h-4" />
        </button>
      }
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   Admin layout
────────────────────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getRecord, isApproved }  = useAdminAccessStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Wait for hydration
  if (!mounted) return null;

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (typeof window !== 'undefined') router.push('/auth/login?redirect=/admin');
    return null;
  }

  // Not an admin-role user at all
  if (!['admin', 'super_admin', 'manager'].includes(user.role)) {
    return (
      <BlockedScreen
        icon={ShieldOff}
        title="Access Denied"
        subtitle="Your account does not have admin privileges. Contact the owner if you believe this is an error."
      />
    );
  }

  // super_admin always has access
  const isSuperAdmin = user.role === 'super_admin';

  if (!isSuperAdmin) {
    const record = getRecord(user.id);

    // No request made yet
    if (!record) {
      return <RequestAccessScreen userId={user.id} userName={user.name} userEmail={user.email} />;
    }

    // Pending approval
    if (record.status === 'pending') {
      return (
        <BlockedScreen
          icon={Clock}
          title="Awaiting Approval"
          subtitle="Your access request is pending owner review. Please check back later."
        />
      );
    }

    // Revoked
    if (record.status === 'revoked') {
      return (
        <BlockedScreen
          icon={ShieldOff}
          title="Access Revoked"
          subtitle={`Your admin access was revoked${record.revokedBy ? ` by ${record.revokedBy}` : ''} on ${record.revokedAt ? new Date(record.revokedAt).toLocaleDateString() : '—'}. Contact the owner to restore access.`}
        />
      );
    }

    // Approved but check expiry for temporary access
    if (record.status === 'approved' && !isApproved(user.id)) {
      return (
        <BlockedScreen
          icon={RefreshCw}
          title="Access Expired"
          subtitle={`Your temporary admin access expired on ${record.expiresAt ? new Date(record.expiresAt).toLocaleDateString() : '—'}. Contact the owner to renew your access.`}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
