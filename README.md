# Craftpack Solution — Enterprise Digital Platform

> Ethiopia's premier paper bag and packaging manufacturer's complete digital platform.
> Built with Next.js 14, Three.js, Node.js/Express, PostgreSQL, and Tailwind CSS.

---

## 🏗 Architecture Overview

```
Craftpack_Solution/
├── frontend/          # Next.js 14 (App Router) — Public website + Admin + Customer Dashboard
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   │   ├── (public)/      # Public website layout group
│   │   │   │   ├── page.tsx   # Homepage
│   │   │   │   ├── products/  # Product catalog
│   │   │   │   ├── about/     # About page
│   │   │   │   ├── quote/     # Quote request
│   │   │   │   ├── contact/   # Contact page
│   │   │   │   └── ...        # Other public pages
│   │   │   ├── admin/         # Admin dashboard (protected)
│   │   │   ├── dashboard/     # Customer dashboard (protected)
│   │   │   └── auth/          # Authentication pages
│   │   ├── components/
│   │   │   ├── 3d/            # Three.js / React Three Fiber components
│   │   │   ├── admin/         # Admin dashboard components
│   │   │   ├── home/          # Homepage sections
│   │   │   ├── layout/        # Navbar, Footer, etc.
│   │   │   ├── products/      # Product catalog components
│   │   │   ├── forms/         # Quote, Contact, Order forms
│   │   │   └── ui/            # Shared UI components
│   │   ├── lib/               # API client, utilities
│   │   ├── store/             # Zustand state management
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript type definitions
│   └── ...
│
├── backend/           # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Auth, error handling, security
│   │   ├── services/          # Email, Socket.io, uploads
│   │   ├── utils/             # Helpers, logger, JWT
│   │   └── config/            # Database connection
│   └── prisma/
│       ├── schema.prisma      # Full database schema
│       └── seed.ts            # Database seeder
│
└── docs/              # Additional documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Cloudinary account
- SMTP email service

### 1. Clone and install

```bash
# Clone the repository
git clone <your-repo>
cd Craftpack_Solution

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Environment setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

### 3. Database setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Run development servers

```bash
# Terminal 1: Backend (port 5000)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Health**: http://localhost:5000/health

**Default admin credentials** (after seeding):
- Email: `admin@craftpacksolution.com`
- Password: `Admin@Craftpack2024!`

---

## 📦 Features

### Public Website
- ✅ Immersive 3D hero section with Three.js paper bag models
- ✅ Interactive product catalog with filters
- ✅ Quote request system (multi-step form)
- ✅ Industries served page
- ✅ Portfolio showcase
- ✅ Blog/news section
- ✅ Contact form
- ✅ FAQ page
- ✅ Responsive mobile-first design
- ✅ SEO optimized

### E-Commerce System
- ✅ Product catalog with categories
- ✅ Real-time cart with Zustand
- ✅ Custom order configuration
- ✅ Bulk pricing tiers
- ✅ Logo/brand upload
- ✅ Order tracking
- ✅ Invoice generation
- ✅ Email notifications

### Customer Dashboard
- ✅ Order history & tracking
- ✅ Order timeline
- ✅ Quote management
- ✅ Profile settings
- ✅ Saved addresses

### Admin Dashboard
- ✅ Revenue analytics with charts
- ✅ Order management
- ✅ Customer database
- ✅ Product management
- ✅ Inventory tracking
- ✅ Quote management
- ✅ Blog management
- ✅ Activity logs
- ✅ System settings
- ✅ Export reports (CSV)

### Security
- ✅ JWT + Refresh token rotation
- ✅ bcrypt password hashing (cost 12)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting (global + per-route)
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Prisma ORM
- ✅ Role-based access control
- ✅ Activity audit logging

---

## 🗄 Database Schema

Key entities and relationships:

```
User ──< Order ──< OrderItem >── ProductVariant >── Product
User ──< QuoteRequest ──< QuoteProduct
User ──< Notification
User ──< ActivityLog
Product ──< ProductVariant
Product ──< BulkPricingTier
Product ──< ProductCustomization
Product ──< ProductReview
Order ──< OrderTimeline
Order ──< PaymentLog
InventoryItem (standalone)
BlogPost (standalone)
ContactInquiry (standalone)
SystemSetting (standalone)
```

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5000/api/v1
Production:  https://api.craftpacksolution.com/api/v1
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
| Method | Endpoint               | Description            | Auth |
|--------|------------------------|------------------------|------|
| POST   | /auth/register         | Create account         | No   |
| POST   | /auth/login            | Login                  | No   |
| POST   | /auth/logout           | Logout                 | Yes  |
| POST   | /auth/refresh          | Refresh access token   | No   |
| POST   | /auth/forgot-password  | Request reset link     | No   |
| POST   | /auth/reset-password   | Reset password         | No   |
| GET    | /auth/me               | Get current user       | Yes  |
| PUT    | /auth/me               | Update profile         | Yes  |
| PUT    | /auth/me/password      | Change password        | Yes  |

#### Products
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| GET    | /products                   | List products         | No   |
| GET    | /products/featured          | Featured products     | No   |
| GET    | /products/search?q=...      | Search products       | No   |
| GET    | /products/category/:cat     | By category           | No   |
| GET    | /products/slug/:slug        | By slug               | No   |
| GET    | /products/:id               | By ID                 | No   |
| POST   | /products                   | Create product        | Admin|
| PUT    | /products/:id               | Update product        | Admin|
| DELETE | /products/:id               | Soft delete           | Admin|

#### Orders
| Method | Endpoint                | Description           | Auth    |
|--------|-------------------------|-----------------------|---------|
| POST   | /orders                 | Create order          | Customer|
| GET    | /orders/my              | My orders             | Customer|
| GET    | /orders/:id             | Order details         | Owner/Admin|
| PATCH  | /orders/:id/cancel      | Cancel order          | Owner   |
| GET    | /orders/:id/invoice     | Get invoice           | Owner/Admin|
| GET    | /orders                 | All orders            | Admin   |
| PATCH  | /orders/:id/status      | Update status         | Admin   |

#### Analytics (Admin only)
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------| 
| GET    | /analytics/dashboard        | Dashboard stats          |
| GET    | /analytics/revenue?period=  | Revenue over time        |
| GET    | /analytics/orders?period=   | Order trends             |
| GET    | /analytics/top-products     | Top performing products  |
| GET    | /analytics/customers/segments| Customer segments       |
| GET    | /analytics/geography        | Geographic distribution  |
| GET    | /analytics/export?type=&period=| Export CSV report      |

---

## 🚢 Deployment

### Frontend — Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
# NEXT_PUBLIC_APP_URL=https://craftpacksolution.com
```

### Backend — Railway

1. Create Railway account at railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set environment variables from `.env.example`
5. Deploy

```bash
# Or deploy to Render
# Create render.yaml in /backend:
services:
  - type: web
    name: craftpack-api
    env: node
    buildCommand: npm install && npm run build && npm run db:migrate
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: craftpack-db
          property: connectionString
```

### Docker (Alternative)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/craftpack
    depends_on: [db]
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: craftpack
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://api:5000/api/v1

volumes:
  postgres_data:
```

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change all default passwords (admin seed account)
- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, random `JWT_SECRET` (min 64 chars)
- [ ] Enable HTTPS on all services
- [ ] Configure proper CORS origin (not wildcard)
- [ ] Set up database backups (daily)
- [ ] Configure Cloudflare or similar CDN/WAF
- [ ] Enable Prisma connection pooling for production
- [ ] Set up monitoring (Sentry, Datadog)
- [ ] Configure log rotation
- [ ] Review and restrict file upload types/sizes
- [ ] Enable rate limiting on all public endpoints
- [ ] Set up SSL certificates

---

## 📊 Performance Optimization

### Frontend
- Next.js Image optimization with WebP/AVIF
- Code splitting with dynamic imports
- Three.js canvas lazy-loaded
- Tailwind CSS purge in production
- Font preloading
- Static page generation where possible

### Backend
- Database indexes on frequently queried fields
- Query pagination (never load all records)
- Connection pooling with Prisma
- Response compression with `compression`
- Redis caching for analytics (optional)

---

## 🛠 Tech Stack Summary

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | Next.js 14, React 18, TypeScript              |
| Styling     | Tailwind CSS, Framer Motion                   |
| 3D          | Three.js, React Three Fiber, Drei             |
| State       | Zustand, React Query                          |
| Forms       | React Hook Form, Zod                          |
| Charts      | Recharts                                      |
| Backend     | Node.js, Express.js, TypeScript               |
| Database    | PostgreSQL, Prisma ORM                        |
| Auth        | JWT (access + refresh tokens), bcrypt         |
| Email       | Nodemailer (SMTP)                             |
| Files       | Cloudinary                                    |
| Real-time   | Socket.io                                     |
| Logging     | Winston                                       |
| Deployment  | Vercel (frontend), Railway (backend)          |

---

## 📞 Support

- **Business Hours**: Monday–Saturday, 8 AM–8 PM EAT
- **Email**: info@craftpacksolution.com
- **Phone**: +251 911 000 000
- **Location**: Bole Sub-city, Addis Ababa, Ethiopia

---

*© 2024 Craftpack Solution. All rights reserved.*
