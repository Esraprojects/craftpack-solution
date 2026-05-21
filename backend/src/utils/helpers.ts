export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random    = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CP-${timestamp}-${random}`;
}

export function paginate(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

export function sanitizeUser<T extends { password?: string }>(user: T): Omit<T, 'password'> {
  const { password: _pw, ...safe } = user;
  return safe;
}

export function getDateRange(period: string): { start: Date; end: Date } {
  const end   = new Date();
  const start = new Date();

  switch (period) {
    case '7d':   start.setDate(end.getDate() - 7);          break;
    case '30d':  start.setDate(end.getDate() - 30);         break;
    case '90d':  start.setDate(end.getDate() - 90);         break;
    case '1y':   start.setFullYear(end.getFullYear() - 1);  break;
    case 'ytd':  start.setMonth(0, 1); start.setHours(0, 0, 0, 0); break;
    default:     start.setDate(end.getDate() - 30);
  }

  return { start, end };
}
