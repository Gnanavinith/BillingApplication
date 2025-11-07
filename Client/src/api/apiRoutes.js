// API endpoints in one place

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  BASE_URL,
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
  },
  PRODUCTS: {
    LIST: '/products',
    BY_ID: (id) => `/products/${id}`,
    STOCK: (id) => `/products/${id}/stock`,
  },
  DEALERS: {
    LIST: '/dealers',
    BY_ID: (id) => `/dealers/${id}`,
  },
  BILLING: {
    LIST: '/billing',
    BY_ID: (id) => `/billing/${id}`,
    STATUS: (id) => `/billing/${id}/status`,
  },
  CUSTOMERS: {
    LIST: '/customers',
    SEARCH: '/customers/search',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    WEEKLY_SALES: '/dashboard/weekly-sales',
  },
  REPORTS: {
    SALES: '/reports/sales',
    PROFIT_LOSS: '/reports/profit-loss',
    STOCK: '/reports/stock',
  },
};

export default API_ROUTES;

