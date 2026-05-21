import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

interface ActivityInput {
  userId:    string;
  action:    string;
  resource:  string;
  resourceId: string;
  details?:  Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(input: ActivityInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId:    input.userId,
        action:    input.action,
        resource:  input.resource,
        resourceId: input.resourceId,
        details:   input.details as Prisma.InputJsonValue | undefined,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  } catch {
    // Activity logging failure must not break main flow
  }
}
