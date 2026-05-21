import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export function setupSocketHandlers(io: SocketIOServer): void {
  // Authentication middleware for sockets
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token as string;
    if (!token) {
      next(new Error('Authentication required'));
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
      socket.userId   = payload.id;
      socket.userRole = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    // Join personal room
    socket.join(`user:${socket.userId}`);

    // Admins join admin room for broadcast notifications
    if (socket.userRole && ['admin', 'super_admin', 'manager'].includes(socket.userRole)) {
      socket.join('admin');
    }

    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}

// Emit helpers
export function emitToUser(io: SocketIOServer, userId: string, event: string, data: unknown): void {
  io.to(`user:${userId}`).emit(event, data);
}

export function emitToAdmin(io: SocketIOServer, event: string, data: unknown): void {
  io.to('admin').emit(event, data);
}

export function emitOrderUpdate(io: SocketIOServer, orderId: string, data: unknown): void {
  io.to(`order:${orderId}`).emit('order:updated', data);
}
