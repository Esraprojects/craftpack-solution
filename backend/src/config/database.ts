import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // Allow prisma to persist across HMR in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () =>
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn',  emit: 'event' },
    ],
  });

export const prisma: PrismaClient =
  globalThis.__prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  (prisma as unknown as { $on: (event: string, handler: (e: { duration: number; query: string }) => void) => void })
    .$on('query', e => {
      if (e.duration > 100) {
        logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
      }
    });
}
