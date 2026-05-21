// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'admin' | 'super_admin' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  address?: Address;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  notifications: boolean;
  newsletter: boolean;
  language: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export type ProductCategory =
  | 'paper_bags'
  | 'shopping_bags'
  | 'kraft_bags'
  | 'luxury_bags'
  | 'food_packaging'
  | 'gift_bags'
  | 'custom_printed'
  | 'eco_friendly'
  | 'industrial';

export type MaterialType =
  | 'kraft_paper'
  | 'art_paper'
  | 'recycled_paper'
  | 'coated_paper'
  | 'duplex_board'
  | 'ivory_board'
  | 'corrugated';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  size: ProductSize;
  material: MaterialType;
  weight?: number;
  stock: number;
  minOrder: number;
  images: string[];
}

export interface ProductSize {
  width: number;
  height: number;
  depth?: number;
  unit: 'cm' | 'mm' | 'inch';
}

export interface ProductCustomization {
  logoUpload: boolean;
  customColors: boolean;
  customText: boolean;
  embossing: boolean;
  foilStamping: boolean;
  spotUV: boolean;
  lamination: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  images: string[];
  thumbnail: string;
  model3dUrl?: string;
  variants: ProductVariant[];
  basePrice: number;
  bulkPricing: BulkPricingTier[];
  customization: ProductCustomization;
  features: string[];
  applications: string[];
  specifications: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  seo: SEOMeta;
  createdAt: string;
  updatedAt: string;
}

export interface BulkPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  discountPercent: number;
}

// ─── Orders ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'quality_check'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';

export type OrderType = 'standard' | 'bulk' | 'custom' | 'wholesale';

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customization?: OrderCustomization;
}

export interface OrderCustomization {
  logoUrl?: string;
  logoPosition?: string;
  printColors?: string[];
  customText?: string;
  specialInstructions?: string;
  pantoneColors?: string[];
  finishType?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: User;
  items: OrderItem[];
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  invoiceUrl?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
  updatedBy?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  customization?: OrderCustomization;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ─── Quote ─────────────────────────────────────────────────────────────────────
export type QuoteStatus = 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired';

export interface QuoteRequest {
  id: string;
  userId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  products: QuoteProduct[];
  deliveryDate?: string;
  budget?: string;
  specialRequirements?: string;
  status: QuoteStatus;
  quotedAmount?: number;
  adminNotes?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface QuoteProduct {
  productId?: string;
  productName: string;
  category: string;
  quantity: number;
  size?: string;
  material?: string;
  customization?: string;
}

// ─── Analytics ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  activeProducts: number;
  pendingOrders: number;
  lowStockItems: number;
  conversionRate: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growthRate: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  averageOrderValue: number;
  color: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  readTime: number;
  isPublished: boolean;
  publishedAt?: string;
  seo: SEOMeta;
  createdAt: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  products: string[];
  clients: string[];
  caseStudy?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar?: string;
  rating: number;
  content: string;
  productUsed?: string;
  date: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type: 'general' | 'quote' | 'support' | 'partnership';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}
