'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccessStatus = 'pending' | 'approved' | 'revoked' | 'expired';
export type AccessType   = 'permanent' | 'temporary';

export interface AdminAccessRecord {
  userId:      string;
  userName:    string;
  userEmail:   string;
  status:      AccessStatus;
  accessType:  AccessType;
  expiresAt:   string | null;   // ISO date string, null = permanent
  grantedAt:   string | null;
  grantedBy:   string | null;   // super_admin name
  revokedAt:   string | null;
  revokedBy:   string | null;
  requestedAt: string;
  notes:       string;
}

interface AdminAccessState {
  records: AdminAccessRecord[];

  /* Read */
  getRecord:    (userId: string) => AdminAccessRecord | undefined;
  isApproved:   (userId: string) => boolean;

  /* Write (super_admin only — UI enforces this) */
  requestAccess:  (userId: string, userName: string, userEmail: string) => void;
  grantAccess:    (userId: string, type: AccessType, expiresAt: string | null, grantedBy: string) => void;
  revokeAccess:   (userId: string, revokedBy: string) => void;
  updateExpiry:   (userId: string, expiresAt: string | null) => void;
  deleteRecord:   (userId: string) => void;
}

export const useAdminAccessStore = create<AdminAccessState>()(
  persist(
    (set, get) => ({
      records: [],

      getRecord: (userId) => get().records.find(r => r.userId === userId),

      isApproved: (userId) => {
        const r = get().getRecord(userId);
        if (!r || r.status !== 'approved') return false;
        if (r.accessType === 'temporary' && r.expiresAt) {
          if (new Date(r.expiresAt) < new Date()) return false;
        }
        return true;
      },

      requestAccess: (userId, userName, userEmail) => {
        if (get().getRecord(userId)) return;  // already exists
        set(s => ({
          records: [...s.records, {
            userId, userName, userEmail,
            status: 'pending', accessType: 'permanent',
            expiresAt: null, grantedAt: null, grantedBy: null,
            revokedAt: null, revokedBy: null,
            requestedAt: new Date().toISOString(),
            notes: '',
          }],
        }));
      },

      grantAccess: (userId, type, expiresAt, grantedBy) =>
        set(s => ({
          records: s.records.map(r =>
            r.userId === userId
              ? { ...r, status: 'approved', accessType: type, expiresAt, grantedAt: new Date().toISOString(), grantedBy, revokedAt: null, revokedBy: null }
              : r
          ),
        })),

      revokeAccess: (userId, revokedBy) =>
        set(s => ({
          records: s.records.map(r =>
            r.userId === userId
              ? { ...r, status: 'revoked', revokedAt: new Date().toISOString(), revokedBy }
              : r
          ),
        })),

      updateExpiry: (userId, expiresAt) =>
        set(s => ({
          records: s.records.map(r =>
            r.userId === userId ? { ...r, expiresAt } : r
          ),
        })),

      deleteRecord: (userId) =>
        set(s => ({ records: s.records.filter(r => r.userId !== userId) })),
    }),
    { name: 'craftpack-admin-access' }
  )
);
