import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { safeLocalStorage, safeSetLocalStorage } from './utils';
import type { ApiError, ApiResponse, AuthTokens } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.client.interceptors.request.use(config => {
      const token = safeLocalStorage('access_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.client.interceptors.response.use(
      res => res,
      async (error: AxiosError<ApiError>) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !original._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshQueue.push(token => {
                if (original.headers) original.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(original));
              });
            });
          }

          original._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = safeLocalStorage('refresh_token');
            const { data } = await axios.post<ApiResponse<AuthTokens>>(
              `${BASE_URL}/auth/refresh`,
              { refreshToken }
            );
            const { accessToken } = data.data;
            safeSetLocalStorage('access_token', accessToken);
            this.refreshQueue.forEach(cb => cb(accessToken));
            this.refreshQueue = [];
            if (original.headers) original.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(original);
          } catch {
            safeLocalStorage('access_token');
            safeLocalStorage('refresh_token');
            if (typeof window !== 'undefined') window.location.href = '/auth/login';
            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const { data } = await this.client.get<ApiResponse<T>>(url, { params });
    return data;
  }

  async post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const { data } = await this.client.post<ApiResponse<T>>(url, body);
    return data;
  }

  async put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const { data } = await this.client.put<ApiResponse<T>>(url, body);
    return data;
  }

  async patch<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const { data } = await this.client.patch<ApiResponse<T>>(url, body);
    return data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const { data } = await this.client.delete<ApiResponse<T>>(url);
    return data;
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const { data } = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}

export const api = new ApiClient();

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  login:         (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register:      (data: unknown)            => api.post('/auth/register', data),
  logout:        ()                         => api.post('/auth/logout'),
  refreshToken:  (refreshToken: string)     => api.post('/auth/refresh', { refreshToken }),
  forgotPassword:(email: string)            => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  verifyEmail:   (token: string)            => api.post('/auth/verify-email', { token }),
  me:            ()                         => api.get('/auth/me'),
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  getAll:      (params?: Record<string, unknown>) => api.get('/products', params),
  getById:     (id: string)                       => api.get(`/products/${id}`),
  getBySlug:   (slug: string)                     => api.get(`/products/slug/${slug}`),
  getFeatured: ()                                 => api.get('/products/featured'),
  getByCategory: (category: string)              => api.get(`/products/category/${category}`),
  search:      (query: string)                    => api.get('/products/search', { q: query }),
  create:      (data: unknown)                    => api.post('/products', data),
  update:      (id: string, data: unknown)        => api.put(`/products/${id}`, data),
  delete:      (id: string)                       => api.delete(`/products/${id}`),
  uploadImage: (id: string, form: FormData)       => api.upload(`/products/${id}/images`, form),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll:      (params?: Record<string, unknown>) => api.get('/orders', params),
  getById:     (id: string)                       => api.get(`/orders/${id}`),
  getMyOrders: ()                                 => api.get('/orders/my'),
  create:      (data: unknown)                    => api.post('/orders', data),
  updateStatus:(id: string, status: string, message?: string) =>
    api.patch(`/orders/${id}/status`, { status, message }),
  cancel:      (id: string, reason: string)       => api.patch(`/orders/${id}/cancel`, { reason }),
  generateInvoice: (id: string)                   => api.get(`/orders/${id}/invoice`),
};

// ─── Quotes API ───────────────────────────────────────────────────────────────
export const quotesApi = {
  submit:      (data: unknown) => api.post('/quotes', data),
  getAll:      (params?: Record<string, unknown>) => api.get('/quotes', params),
  getById:     (id: string)    => api.get(`/quotes/${id}`),
  getMyQuotes: ()              => api.get('/quotes/my'),
  respond:     (id: string, data: unknown) => api.patch(`/quotes/${id}/respond`, data),
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsApi = {
  getDashboardStats:  ()                              => api.get('/analytics/dashboard'),
  getRevenueData:     (period: string)                => api.get('/analytics/revenue', { period }),
  getOrderTrends:     (period: string)                => api.get('/analytics/orders', { period }),
  getTopProducts:     ()                              => api.get('/analytics/top-products'),
  getCustomerSegments:()                              => api.get('/analytics/customers/segments'),
  getGeoData:         ()                              => api.get('/analytics/geography'),
  exportReport:       (type: string, period: string) => api.get('/analytics/export', { type, period }),
};

// ─── Customers API ────────────────────────────────────────────────────────────
export const customersApi = {
  getAll:     (params?: Record<string, unknown>) => api.get('/customers', params),
  getById:    (id: string)  => api.get(`/customers/${id}`),
  update:     (id: string, data: unknown) => api.put(`/customers/${id}`, data),
  delete:     (id: string)  => api.delete(`/customers/${id}`),
  getHistory: (id: string)  => api.get(`/customers/${id}/orders`),
};

// ─── Inventory API ────────────────────────────────────────────────────────────
export const inventoryApi = {
  getAll:    (params?: Record<string, unknown>) => api.get('/inventory', params),
  getById:   (id: string)               => api.get(`/inventory/${id}`),
  update:    (id: string, data: unknown) => api.put(`/inventory/${id}`, data),
  create:    (data: unknown)            => api.post('/inventory', data),
  getAlerts: ()                         => api.get('/inventory/alerts'),
};

// ─── Blog API ─────────────────────────────────────────────────────────────────
export const blogApi = {
  getAll:     (params?: Record<string, unknown>) => api.get('/blog', params),
  getBySlug:  (slug: string) => api.get(`/blog/${slug}`),
  create:     (data: unknown) => api.post('/blog', data),
  update:     (id: string, data: unknown) => api.put(`/blog/${id}`, data),
  delete:     (id: string)   => api.delete(`/blog/${id}`),
};

// ─── Contact API ──────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: unknown) => api.post('/contact', data),
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const notificationsApi = {
  getAll:    ()          => api.get('/notifications'),
  markRead:  (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: ()         => api.patch('/notifications/read-all'),
  delete:    (id: string) => api.delete(`/notifications/${id}`),
};
