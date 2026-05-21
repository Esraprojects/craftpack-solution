# Craftpack Solution — Enterprise Digital Platform

> Ethiopia's premier paper bag and packaging manufacturer's complete digital platform.
> Built with Next.js 14, Three.js, Node.js/Express, PostgreSQL (Supabase), and Tailwind CSS.

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Website** | https://craftpack-solution-38p4gv3kb-esraprojects-projects.vercel.app |
| **Backend API** | https://craftpack-api.onrender.com |
| **API Health** | https://craftpack-api.onrender.com/health |
| **GitHub** | https://github.com/Esraprojects/craftpack-solution |

---

## 🏢 Business Information

- **Company**: Craftpack Solution
- **Location**: Gofa Camp & Gurdshola, Addis Ababa, Ethiopia
- **Phone**: 0901 236 509 / 0957 117 787 / 0910 628 159
- **Email**: info@craftpacksolution.com
- **Business Hours**: Monday–Saturday, 8 AM–6 PM EAT

---

## 🏗 Architecture Overview

```
Craftpack_Solution/
├── frontend/          # Next.js 14 (App Router) — Public website + Admin + Customer Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Homepage, Products, Quote, Contact
│   │   │   ├── admin/         # Admin dashboard (protected)
│   │   │   ├── dashboard/     # Customer dashboard (protected)
│   │   │   └── auth/          # Login, Register
│   │   ├── components/
│   │   │   ├── 3d/            # Three.js / React Three Fiber hero scene
│   │   │   ├── admin/         # Admin dashboard components
│   │   │   ├── home/          # Homepage sections
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── products/      # Product catalog
│   │   │   ├── forms/         # Quote, Contact forms
│   │   │   └── ui/            # Shared UI (Cart drawer, etc.)
│   │   ├── lib/               # Axios API client with JWT refresh
│   │   ├── store/             # Zustand (auth + cart)
│   │   └── types/             # TypeScript types
│   ├── vercel.json            # Vercel deployment config
│   └── next.config.js
│
├── backend/           # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling, security
│   │   ├── services/          # Email (Nodemailer), Socket.io
│   │   ├── utils/             # JWT, logger, helpers
│   │   └── config/            # Prisma database config
│   ├── prisma/
│   │   ├── schema.prisma      # 21-model database schema
│   │   └── seed.ts            # Database seeder
│   └── render.yaml            # Render deployment config
│
├── render.yaml                # Root Render config
└── package.json               # Monorepo root (concurrently)
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local) or a Supabase project

### 1. Clone and install

```bash
git clone https://github.com/Esraprojects/craftpack-solution.git
cd craftpack-solution
npm run install:all
```

### 2. Environment setup

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in DATABASE_URL, JWT_SECRET, SMTP credentials

# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Database setup

```bash
cd backend

# Push schema to database
npx prisma db push

# Seed initial data
npm run db:seed
```

### 4. Run development servers

```bash
# From root — starts both frontend and backend
npm run dev
```

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin |
| API | http://localhost:5000/api/v1 |
| API Health | http://localhost:5000/health |

### Default credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@craftpacksolution.com | Admin@Craftpack2024! |
| Manager | manager@craftpacksolution.com | Manager@Craftpack2024! |
| Customer | procurement@hyatt.com | Test1234! |

---

## 📦 Features

### Public Website
- 3D immersive hero section (Three.js paper bag + bloom post-processing)
- Interactive product catalog with category/material filters
- Multi-step quote request form
- Contact form with Google Maps link
- Responsive mobile-first design
- SEO-optimized metadata

### E-Commerce
- Product catalog with variants and bulk pricing tiers
- Real-time cart (Zustand + localStorage persist)
- Custom order configuration (logo upload, colours, text)
- Order tracking with timeline
- Email confirmations (Nodemailer)

### Admin Dashboard
- Revenue analytics (AreaChart, PieChart, BarChart — Recharts)
- Order management with status updates
- Customer database
- Product & inventory management
- Quote management
- Blog management
- Activity audit logs
- CSV export reports

### Security
- JWT access tokens (15 min) + refresh token rotation (7 days)
- bcrypt password hashing (cost factor 12)
- Helmet.js security headers
- CORS with Vercel wildcard + explicit origin
- Global rate limiting (100 req / 15 min)
- Input validation with Zod
- Role-based access control: `customer`, `manager`, `admin`, `super_admin`
- SQL injection prevention via Prisma ORM

---

## 🗄 Database Schema

21 Prisma models across 3 domains:

```
User ──< RefreshToken
User ──< Address
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

InventoryItem   (standalone)
BlogPost        (standalone)
ContactInquiry  (standalone)
SystemSetting   (standalone)
```

---

## 🔌 API Reference

### Base URL
```
Local:       http://localhost:5000/api/v1
Production:  https://craftpack-api.onrender.com/api/v1
```

### Authentication
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Login | No |
| POST | /auth/logout | Logout | Yes |
| POST | /auth/refresh | Refresh token | No |
| POST | /auth/forgot-password | Reset link | No |
| POST | /auth/reset-password | Reset password | No |
| GET | /auth/me | Current user | Yes |
| PUT | /auth/me | Update profile | Yes |
| PUT | /auth/me/password | Change password | Yes |

#### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /products | List all | No |
| GET | /products/featured | Featured | No |
| GET | /products/search?q= | Search | No |
| GET | /products/category/:cat | By category | No |
| GET | /products/slug/:slug | By slug | No |
| GET | /products/:id | By ID | No |
| GET | /products/:id/reviews | Reviews | No |
| POST | /products/:id/reviews | Add review | Customer |
| POST | /products | Create | Admin |
| PUT | /products/:id | Update | Admin |
| DELETE | /products/:id | Delete | Admin |

#### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /orders | Create order | Customer |
| GET | /orders/my | My orders | Customer |
| GET | /orders/:id | Order details | Owner/Admin |
| PATCH | /orders/:id/cancel | Cancel | Owner |
| GET | /orders | All orders | Admin |
| PATCH | /orders/:id/status | Update status | Admin |

#### Quotes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /quotes | Submit quote | No |
| GET | /quotes/my | My quotes | Customer |
| GET | /quotes/:id | Quote detail | Owner/Admin |
| GET | /quotes | All quotes | Admin |
| PATCH | /quotes/:id/respond | Respond | Admin |

#### Analytics (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /analytics/dashboard | Stats & KPIs |
| GET | /analytics/revenue | Revenue over time |
| GET | /analytics/orders | Order trends |
| GET | /analytics/top-products | Top products |
| GET | /analytics/customers/segments | Segments |
| GET | /analytics/export | CSV export |

---

## 🚢 Deployment (Current — Free Tier)

| Service | Provider | Purpose |
|---------|----------|---------|
| Frontend | Vercel (free) | Next.js hosting |
| Backend | Render (free) | Node.js API |
| Database | Supabase (free) | PostgreSQL |
| Code | GitHub | Source control |

### Frontend — Vercel

```bash
cd frontend
vercel deploy --prod
```

Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://craftpack-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://craftpack-solution.vercel.app
NEXT_PUBLIC_APP_NAME=Craftpack Solution
```

### Backend — Render

Render auto-deploys from GitHub using `render.yaml`.

Build command: `npm install && npx prisma generate && npm run build`
Start command: `node dist/index.js`

Required environment variables on Render:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<supabase_pooler_url>
DIRECT_URL=<supabase_session_url>
JWT_SECRET=<min 32 chars>
FRONTEND_URL=https://craftpack-solution.vercel.app
```

### Database — Supabase

- Project: `craftpack` (EU West 1 region)
- Connection: Supabase EU West pooler (IPv4 compatible)
- Schema pushed with: `npx prisma db push`
- Seeded with: `npm run db:seed`

> **Note:** The local machine uses IPv4 only. Connect via the Supabase connection pooler (`aws-0-eu-west-1.pooler.supabase.com`), not the direct host (`db.xxx.supabase.co` — IPv6 only).

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| 3D | Three.js, React Three Fiber, Drei, Postprocessing |
| State | Zustand (persist), React Query |
| Forms | React Hook Form, Zod |
| Charts | Recharts |
| Backend | Node.js 20, Express.js, TypeScript |
| Database | PostgreSQL 17 (Supabase), Prisma ORM v5 |
| Auth | JWT access + refresh tokens, bcrypt |
| Email | Nodemailer (SMTP) |
| Files | Cloudinary |
| Real-time | Socket.io |
| Logging | Winston |
| Hosting | Vercel (frontend), Render (backend), Supabase (DB) |

---

## 🔒 Production Security Checklist

- [ ] Rotate `JWT_SECRET` to a 64+ char random string
- [ ] Change all default seed passwords
- [ ] Configure Cloudinary (media uploads currently disabled)
- [ ] Set up SMTP credentials for transactional email
- [ ] Add a custom domain on Vercel
- [ ] Enable Supabase database backups
- [ ] Set up error monitoring (Sentry)
- [ ] Configure Stripe for payment processing

---

## 📞 Contact

- **Business Hours**: Monday–Saturday, 8 AM–6 PM EAT
- **Email**: info@craftpacksolution.com
- **Phone**: 0901 236 509 / 0957 117 787 / 0910 628 159
- **Location**: Gofa Camp & Gurdshola, Addis Ababa, Ethiopia

---

*© 2025 Craftpack Solution. All rights reserved.*
