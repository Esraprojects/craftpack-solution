import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { prisma } from './config/database';
import { setupSocketHandlers } from './services/socketService';

// Route imports
import authRoutes       from './routes/auth';
import productRoutes    from './routes/products';
import orderRoutes      from './routes/orders';
import quoteRoutes      from './routes/quotes';
import customerRoutes   from './routes/customers';
import inventoryRoutes  from './routes/inventory';
import analyticsRoutes  from './routes/analytics';
import blogRoutes       from './routes/blog';
import contactRoutes    from './routes/contact';
import notificationRoutes from './routes/notifications';
import uploadRoutes     from './routes/upload';
import adminRoutes      from './routes/admin';

const app    = express();
const server = createServer(app);
const io     = new SocketIOServer(server, {
  cors: { origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000', /^https:\/\/.*\.vercel\.app$/], credentials: true },
});

// ── Security Middleware ────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", 'data:', 'https://res.cloudinary.com'],
    },
  },
}));

const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'http://localhost:3000',
  'http://localhost:3000',
  /^https:\/\/.*\.vercel\.app$/,
];
app.use(cors({
  origin:      allowedOrigins,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
}));

// ── Body Parsing ───────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trimEnd()) } }));
}

// ── Health Check ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success:   true,
    status:    'healthy',
    timestamp: new Date().toISOString(),
    service:   'Craftpack API',
    version:   '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ─────────────────────────────────────────────────
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`,          authRoutes);
app.use(`${API_PREFIX}/products`,      productRoutes);
app.use(`${API_PREFIX}/orders`,        orderRoutes);
app.use(`${API_PREFIX}/quotes`,        quoteRoutes);
app.use(`${API_PREFIX}/customers`,     customerRoutes);
app.use(`${API_PREFIX}/inventory`,     inventoryRoutes);
app.use(`${API_PREFIX}/analytics`,     analyticsRoutes);
app.use(`${API_PREFIX}/blog`,          blogRoutes);
app.use(`${API_PREFIX}/contact`,       contactRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/upload`,        uploadRoutes);
app.use(`${API_PREFIX}/admin`,         adminRoutes);

// ── Error Handling ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Socket.IO ──────────────────────────────────────────────────
setupSocketHandlers(io);

// ── Server Start ───────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 5000);

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    server.listen(PORT, () => {
      logger.info(`🚀 Craftpack API running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

bootstrap();

export { app, io };
