import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  profile: '/auth/profile',
  changePassword: '/auth/change-password',
  logout: '/auth/logout',
  
  // Products
  products: '/products',
  product: (id) => `/products/${id}`,
  productStock: (id) => `/products/${id}/stock`,
  lowStockProducts: '/products/low-stock',
  productCategories: '/products/categories/list',
  
  // Customers
  customers: '/customers',
  customer: (id) => `/customers/${id}`,
  customerStats: (id) => `/customers/${id}/stats`,
  customerSearch: (query) => `/customers/search/${query}`,
  customerTypes: '/customers/types/list',
  
  // Transactions
  transactions: '/transactions',
  transaction: (id) => `/transactions/${id}`,
  transactionRefund: (id) => `/transactions/${id}/refund`,
  transactionStats: '/transactions/stats/summary',
  transactionSearch: (query) => `/transactions/search/${query}`,
  salesReport: '/transactions/reports/sales',
  
  // Dashboard
  dashboardStats: '/dashboard/stats',
  salesChart: '/dashboard/charts/sales',
  categoryChart: '/dashboard/charts/categories',
  paymentChart: '/dashboard/charts/payment-methods',
  topProductsChart: '/dashboard/charts/top-products',
  oldGoldChart: '/dashboard/charts/old-gold',
  recentTransactions: '/dashboard/recent-transactions',
  lowStockAlerts: '/dashboard/low-stock',
  
  // Notifications
  notifications: '/notifications',
  notification: (id) => `/notifications/${id}`,
  markAsRead: (id) => `/notifications/${id}/read`,
  markAllRead: '/notifications/mark-all-read',
  unreadCount: '/notifications/unread-count',
  
  // System Notifications (Super Admin)
  systemNotifications: '/notifications/system/all',
  systemNotification: (id) => `/notifications/system/${id}`,
  createSystemNotification: '/notifications/system',
  updateSystemNotification: (id) => `/notifications/system/${id}`,
  deactivateSystemNotification: (id) => `/notifications/system/${id}/deactivate`,
  deleteSystemNotification: (id) => `/notifications/system/${id}`,
  notificationTypes: '/notifications/types/list',
  
  // Shops (Super Admin)
  shops: '/shops',
  shop: (id) => `/shops/${id}`,
  shopStats: (id) => `/shops/${id}/stats`,
  shopSearch: (query) => `/shops/search/${query}`,
  
  // Health check
  health: '/health',
};

// Helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return { success: false, error: message };
  },
  
  // Format date for API
  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  },
  
  // Format date range for API
  formatDateRange: (startDate, endDate) => {
    return {
      startDate: apiHelpers.formatDate(startDate),
      endDate: apiHelpers.formatDate(endDate),
    };
  },
  
  // Build query parameters
  buildQueryParams: (params) => {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },
  
  // Download file from API
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};

// Export default api instance
export default api;
