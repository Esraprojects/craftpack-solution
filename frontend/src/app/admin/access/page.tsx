'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Clock, CheckCircle, XCircle, RefreshCw,
  Calendar, User, Mail, Trash2, Edit3, Plus, ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminAccessStore, type AdminAccessRecord, type AccessType } from '@/store/useAdminAccessStore';

/* ──────────────────────────────────────────────────────────────
   Status badge helper
────────────────────────────────────────────────────────────── */
function StatusBadge({ status, expiresAt }: { status: string; expiresAt: string | null }) {
  const isExpired = status === 'approved' && expiresAt && new Date(expiresAt) < new Date();
  const s = isExpired ? 'expired' : status;
  const map: Record<string, { cls: string; label: string }> = {
    pending:  { cls: 'badge-warning',  label: 'Pending' },
    approved: { cls: 'badge-success',  label: 'Approved' },
    revoked:  { cls: 'badge-danger',   label: 'Revoked' },
    expired:  { cls: 'badge-neutral',  label: 'Expired' },
  };
  const { cls, label } = map[s] ?? map.pending;
  return <span className={cls}>{label}</span>;
}

/* ──────────────────────────────────────────────────────────────
   Grant / Edit modal
────────────────────────────────────────────────────────────── */
function GrantModal({
  record,
  grantedBy,
  onClose,
}: {
  record: AdminAccessRecord;
  grantedBy: string;
  onClose: () => void;
}) {
  const { grantAccess, updateExpiry } = useAdminAccessStore();
  const [type, setType]       = useState<AccessType>(record.accessType);
  const [expiry, setExpiry]   = useState(record.expiresAt ? record.expiresAt.slice(0, 10) : '');

  function handleSave() {
    const expiresAt = type === 'temporary' && expiry ? new Date(expiry).toISOString() : null;
    grantAccess(record.userId, type, expiresAt, grantedBy);
    onClose();
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md card bg-dark-900 border-white/10 p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-400" />
          <h3 className="font-display font-bold text-lg text-white">Grant Admin Access</h3>
        </div>

        <div className="space-y-1 text-sm text-dark-300">
          <p><span className="text-dark-200 font-medium">{record.userName}</span></p>
          <p>{record.userEmail}</p>
        </div>

        <div className="space-y-3">
          <label className="label">Access Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(['permanent', 'temporary'] as AccessType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  type === t
                    ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                    : 'bg-white/5 border-white/10 text-dark-300 hover:bg-white/10'
                }`}
              >
                {t === 'permanent' ? '∞ Permanent' : '⏱ Temporary'}
              </button>
            ))}
          </div>
        </div>

        {type === 'temporary' && (
          <div className="space-y-1">
            <label className="label">Expiry Date</label>
            <input
              type="date"
              value={expiry}
              min={tomorrow}
              onChange={e => setExpiry(e.target.value)}
              className="input-field"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} className="btn-primary flex-1">
            <CheckCircle className="w-4 h-4" /> Grant Access
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Access Management Page
────────────────────────────────────────────────────────────── */
export default function AdminAccessPage() {
  const { user } = useAuthStore();
  const { records, grantAccess, revokeAccess, deleteRecord } = useAdminAccessStore();
  const [editRecord,   setEditRecord]   = useState<AdminAccessRecord | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Shield className="w-10 h-10 text-dark-400 mx-auto" />
          <p className="text-dark-300">Only the owner (super_admin) can manage access.</p>
        </div>
      </div>
    );
  }

  const pending  = records.filter(r => r.status === 'pending');
  const approved = records.filter(r => r.status === 'approved');
  const others   = records.filter(r => r.status === 'revoked' || (r.status === 'approved' && r.expiresAt && new Date(r.expiresAt) < new Date()));

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-brand-400" />
          <h1 className="page-title">Admin Access Control</h1>
        </div>
        <p className="page-description">
          Approve, revoke, and manage admin access for your team. Only you can grant or modify access.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: pending.length,  color: 'text-amber-400',   bg: 'bg-amber-500/10',   icon: Clock },
          { label: 'Active',  count: approved.length, color: 'text-brand-400',   bg: 'bg-brand-500/10',   icon: CheckCircle },
          { label: 'Revoked', count: others.length,   color: 'text-red-400',     bg: 'bg-red-500/10',     icon: XCircle },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-sm text-dark-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Pending Requests ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(r => (
              <motion.div
                key={r.userId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-amber-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{r.userName}</p>
                    <p className="text-sm text-dark-400">{r.userEmail}</p>
                    <p className="text-xs text-dark-500 mt-0.5">
                      Requested {new Date(r.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditRecord(r)} className="btn-primary text-xs px-4 py-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => revokeAccess(r.userId, user.name)}
                    className="btn-danger text-xs px-4 py-2"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Deny
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Active approvals */}
      <section>
        <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Active Access ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="card p-8 text-center text-dark-400 text-sm">No active admin accounts yet.</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-header text-left px-5 py-3">User</th>
                  <th className="table-header text-left px-5 py-3">Type</th>
                  <th className="table-header text-left px-5 py-3">Expires</th>
                  <th className="table-header text-left px-5 py-3">Granted By</th>
                  <th className="table-header px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {approved.map(r => {
                  const expired = r.expiresAt && new Date(r.expiresAt) < new Date();
                  return (
                    <tr key={r.userId} className="hover:bg-white/3 transition-colors">
                      <td className="table-cell px-5">
                        <div className="font-medium text-white">{r.userName}</div>
                        <div className="text-xs text-dark-500">{r.userEmail}</div>
                      </td>
                      <td className="table-cell px-5">
                        <span className={`badge ${r.accessType === 'permanent' ? 'badge-brand' : 'badge-gold'}`}>
                          {r.accessType === 'permanent' ? '∞ Permanent' : '⏱ Temporary'}
                        </span>
                      </td>
                      <td className="table-cell px-5">
                        {r.expiresAt ? (
                          <span className={expired ? 'text-red-400' : 'text-dark-200'}>
                            {new Date(r.expiresAt).toLocaleDateString()}
                            {expired && ' (expired)'}
                          </span>
                        ) : (
                          <span className="text-dark-500">Never</span>
                        )}
                      </td>
                      <td className="table-cell px-5 text-dark-300">{r.grantedBy ?? '—'}</td>
                      <td className="table-cell px-5">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditRecord(r)}
                            className="btn-ghost text-xs px-3 py-1.5"
                            title="Edit access"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmRevoke(r.userId)}
                            className="btn-ghost text-xs px-3 py-1.5 hover:text-red-400"
                            title="Revoke access"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Revoked / expired */}
      {others.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Revoked / Expired ({others.length})
          </h2>
          <div className="space-y-2">
            {others.map(r => (
              <div key={r.userId} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-70">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{r.userName}</p>
                    <p className="text-xs text-dark-500">{r.userEmail}</p>
                  </div>
                  <StatusBadge status={r.status} expiresAt={r.expiresAt} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditRecord(r)} className="btn-secondary text-xs px-3 py-1.5">
                    Re-approve
                  </button>
                  <button
                    onClick={() => deleteRecord(r.userId)}
                    className="btn-ghost text-xs px-3 py-1.5 hover:text-red-400"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grant modal */}
      <AnimatePresence>
        {editRecord && (
          <GrantModal
            record={editRecord}
            grantedBy={user.name}
            onClose={() => setEditRecord(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirm revoke */}
      <AnimatePresence>
        {confirmRevoke && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card bg-dark-900 border-white/10 p-6 max-w-sm w-full space-y-4"
            >
              <h3 className="font-bold text-white font-display">Revoke Access?</h3>
              <p className="text-dark-300 text-sm">
                This user will immediately lose admin access. You can re-approve later.
              </p>
              <div className="flex gap-3">
                <button
                  className="btn-danger flex-1"
                  onClick={() => { revokeAccess(confirmRevoke, user.name); setConfirmRevoke(null); }}
                >
                  Revoke
                </button>
                <button className="btn-secondary" onClick={() => setConfirmRevoke(null)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
