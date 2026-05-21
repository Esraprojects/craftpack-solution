import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { getDateRange } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

// ── Dashboard Stats ────────────────────────────────────────────
export async function getDashboardStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const now       = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders, thisMonthOrders, lastMonthOrders,
      totalRevenue, thisMonthRevenue, lastMonthRevenue,
      totalCustomers, thisMonthCustomers, lastMonthCustomers,
      activeProducts, pendingOrders, lowStockItems,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: lastMonth, lte: lastMonthEnd } } }),

      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid', createdAt: { gte: thisMonth } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid', createdAt: { gte: lastMonth, lte: lastMonthEnd } } }),

      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: thisMonth } } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: lastMonth, lte: lastMonthEnd } } }),

      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.inventoryItem.count({ where: { status: { in: ['low_stock', 'out_of_stock'] } } }),
    ]);

    const revenueChange  = calcChange(thisMonthRevenue._sum.total ?? 0, lastMonthRevenue._sum.total ?? 0);
    const ordersChange   = calcChange(thisMonthOrders, lastMonthOrders);
    const customersChange= calcChange(thisMonthCustomers, lastMonthCustomers);

    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalRevenue:     totalRevenue._sum.total ?? 0,
        revenueChange,
        totalOrders,
        ordersChange,
        totalCustomers,
        customersChange,
        activeProducts,
        pendingOrders,
        lowStockItems,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── Revenue Over Time ─────────────────────────────────────────
export async function getRevenueData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period = '30d' } = req.query as { period?: string };
    const { start, end }     = getDateRange(period);

    const orders = await prisma.order.findMany({
      where:  { createdAt: { gte: start, lte: end }, paymentStatus: 'paid' },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const grouped = new Map<string, { revenue: number; orders: number }>();
    orders.forEach(o => {
      const key = o.createdAt.toISOString().slice(0, 10);
      const prev = grouped.get(key) ?? { revenue: 0, orders: 0 };
      grouped.set(key, { revenue: prev.revenue + o.total, orders: prev.orders + 1 });
    });

    const data = Array.from(grouped.entries()).map(([date, vals]) => ({ date, ...vals }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Order Trends ──────────────────────────────────────────────
export async function getOrderTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period = '30d' } = req.query as { period?: string };
    const { start, end }     = getDateRange(period);

    const statuses = ['pending', 'confirmed', 'in_production', 'delivered', 'cancelled'];
    const counts = await Promise.all(
      statuses.map(status =>
        prisma.order.count({ where: { status: status as never, createdAt: { gte: start, lte: end } } })
      )
    );

    const data = statuses.map((status, i) => ({ status, count: counts[i] }));

    // Monthly trend
    const monthlyOrders = await prisma.$queryRaw<Array<{ month: string; count: bigint; revenue: number }>>`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*)::bigint                as count,
        SUM(total)                      as revenue
      FROM "Order"
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY month
      ORDER BY month
    `;

    res.json({
      success: true,
      data: {
        byStatus:  data,
        byMonth:   monthlyOrders.map(r => ({ month: r.month, count: Number(r.count), revenue: r.revenue })),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── Top Products ──────────────────────────────────────────────
export async function getTopProducts(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by:     ['productId'],
      _sum:   { quantity: true, totalPrice: true },
      _count: { id: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 10,
    });

    const productIds = topProducts.map(p => p.productId);
    const products   = await prisma.product.findMany({
      where:  { id: { in: productIds } },
      select: { id: true, name: true, category: true, thumbnail: true },
    });

    const data = topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        product,
        unitsSold: tp._sum.quantity ?? 0,
        revenue:   tp._sum.totalPrice ?? 0,
        orders:    tp._count.id,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Customer Segments ──────────────────────────────────────────
export async function getCustomerSegments(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const [wholesale, corporate, retail, oneTime] = await Promise.all([
      prisma.order.count({ where: { type: 'wholesale' } }),
      prisma.order.count({ where: { type: 'bulk' } }),
      prisma.order.count({ where: { type: 'standard' } }),
      prisma.user.count({ where: { role: 'customer', orders: { none: {} } } }),
    ]);

    const total = wholesale + corporate + retail;
    res.json({
      success: true,
      data: [
        { segment: 'Wholesale',  count: wholesale,  percentage: pct(wholesale, total),  color: '#0ea5e9' },
        { segment: 'Corporate',  count: corporate,  percentage: pct(corporate, total),  color: '#f59e0b' },
        { segment: 'Retail',     count: retail,     percentage: pct(retail, total),     color: '#10b981' },
        { segment: 'No Orders',  count: oneTime,    percentage: 0,                       color: '#64748b' },
      ],
    });
  } catch (err) {
    next(err);
  }
}

// ── Customer Growth ────────────────────────────────────────────
export async function getCustomerGrowth(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d     = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const count = await prisma.user.count({
        where: { role: 'customer', createdAt: { gte: start, lte: end } },
      });
      months.push({
        month: start.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        new:   count,
      });
    }
    res.json({ success: true, data: months });
  } catch (err) {
    next(err);
  }
}

// ── Geographic Data ────────────────────────────────────────────
export async function getGeographicData(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cityData = await prisma.$queryRaw<Array<{ city: string; count: bigint }>>`
      SELECT "shippingCity" as city, COUNT(*) as count
      FROM "Order"
      GROUP BY "shippingCity"
      ORDER BY count DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: cityData.map(d => ({ city: d.city, count: Number(d.count) })),
    });
  } catch (err) {
    next(err);
  }
}

// ── Export Report ──────────────────────────────────────────────
export async function exportReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type = 'orders', period = '30d' } = req.query as Record<string, string>;
    const { start, end } = getDateRange(period);

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        where:   { createdAt: { gte: start, lte: end } },
        include: { user: { select: { name: true, email: true, company: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const csvRows = [
        ['Order Number', 'Customer', 'Company', 'Email', 'Status', 'Total', 'Date'].join(','),
        ...orders.map(o =>
          [o.orderNumber, `"${o.user.name}"`, `"${o.user.company ?? ''}"`, o.user.email, o.status, o.total.toFixed(2), o.createdAt.toISOString().slice(0, 10)].join(',')
        ),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=orders_${period}.csv`);
      res.send(csvRows);
      return;
    }

    throw new AppError('Unsupported report type', 400);
  } catch (err) {
    next(err);
  }
}

// ── Helpers ───────────────────────────────────────────────────
function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round((n / total) * 100 * 10) / 10;
}
