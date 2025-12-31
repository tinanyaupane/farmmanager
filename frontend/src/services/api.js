// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// ============================================================================
// AUTH APIs
// ============================================================================

export const authAPI = {
    // Register new user
    register: async (userData) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        // Save token
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Login user
    login: async (credentials) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Save token
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Get current user
    getMe: async () => {
        return await apiRequest('/auth/me');
    },

    // Update user details
    updateDetails: async (userData) => {
        return await apiRequest('/auth/updatedetails', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // Update password
    updatePassword: async (passwords) => {
        return await apiRequest('/auth/updatepassword', {
            method: 'PUT',
            body: JSON.stringify(passwords),
        });
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if logged in
    isAuthenticated: () => {
        return !!getToken();
    },

    // Get stored user
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

// ============================================================================
// FLOCK APIs
// ============================================================================

export const flockAPI = {
    // Get all flocks
    getAll: async () => {
        return await apiRequest('/flocks');
    },

    // Get flock statistics
    getStats: async () => {
        return await apiRequest('/flocks/stats');
    },

    // Get single flock
    getById: async (id) => {
        return await apiRequest(`/flocks/${id}`);
    },

    // Create new flock
    create: async (flockData) => {
        return await apiRequest('/flocks', {
            method: 'POST',
            body: JSON.stringify(flockData),
        });
    },

    // Update flock
    update: async (id, flockData) => {
        return await apiRequest(`/flocks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(flockData),
        });
    },

    // Delete flock
    delete: async (id) => {
        return await apiRequest(`/flocks/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// SALES APIs
// ============================================================================

export const salesAPI = {
    // Get all sales
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/sales${query ? `?${query}` : ''}`);
    },

    // Get sales statistics
    getStats: async () => {
        return await apiRequest('/sales/stats');
    },

    // Get single sale
    getById: async (id) => {
        return await apiRequest(`/sales/${id}`);
    },

    // Create new sale
    create: async (saleData) => {
        return await apiRequest('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
    },

    // Update sale
    update: async (id, saleData) => {
        return await apiRequest(`/sales/${id}`, {
            method: 'PUT',
            body: JSON.stringify(saleData),
        });
    },

    // Delete sale
    delete: async (id) => {
        return await apiRequest(`/sales/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// INVENTORY APIs
// ============================================================================

export const inventoryAPI = {
    // Get all inventory items
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/inventory${query ? `?${query}` : ''}`);
    },

    // Get inventory statistics
    getStats: async () => {
        return await apiRequest('/inventory/stats');
    },

    // Get single item
    getById: async (id) => {
        return await apiRequest(`/inventory/${id}`);
    },

    // Create new item
    create: async (itemData) => {
        return await apiRequest('/inventory', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    },

    // Update item
    update: async (id, itemData) => {
        return await apiRequest(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    },

    // Delete item
    delete: async (id) => {
        return await apiRequest(`/inventory/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// HEALTH APIs
// ============================================================================

export const healthAPI = {
    // Get all health entries
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/health${query ? `?${query}` : ''}`);
    },

    // Get health statistics
    getStats: async () => {
        return await apiRequest('/health/stats');
    },

    // Get single entry
    getById: async (id) => {
        return await apiRequest(`/health/${id}`);
    },

    // Create new entry
    create: async (entryData) => {
        return await apiRequest('/health', {
            method: 'POST',
            body: JSON.stringify(entryData),
        });
    },

    // Update entry
    update: async (id, entryData) => {
        return await apiRequest(`/health/${id}`, {
            method: 'PUT',
            body: JSON.stringify(entryData),
        });
    },

    // Delete entry
    delete: async (id) => {
        return await apiRequest(`/health/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// EXPENSE APIs
// ============================================================================

export const expenseAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/expenses${query ? `?${query}` : ''}`);
    },
    getStats: async () => await apiRequest('/expenses/stats'),
    create: async (data) => await apiRequest('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/expenses/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// CUSTOMER APIs
// ============================================================================

export const customerAPI = {
    getAll: async () => await apiRequest('/customers'),
    getStats: async () => await apiRequest('/customers/stats'),
    getById: async (id) => await apiRequest(`/customers/${id}`),
    create: async (data) => await apiRequest('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// DAILY LOG APIs
// ============================================================================

export const dailyLogAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/daily-logs${query ? `?${query}` : ''}`);
    },
    getStats: async () => await apiRequest('/daily-logs/stats'),
    create: async (data) => await apiRequest('/daily-logs', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/daily-logs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/daily-logs/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// VACCINATION APIs
// ============================================================================

export const vaccinationAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/vaccinations${query ? `?${query}` : ''}`);
    },
    getStats: async () => await apiRequest('/vaccinations/stats'),
    getUpcoming: async () => await apiRequest('/vaccinations/upcoming'),
    create: async (data) => await apiRequest('/vaccinations', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/vaccinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    complete: async (id, data) => await apiRequest(`/vaccinations/${id}/complete`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/vaccinations/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// PRODUCT APIs
// ============================================================================

export const productAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/products${query ? `?${query}` : ''}`);
    },
    getById: async (id) => await apiRequest(`/products/${id}`),
    create: async (data) => await apiRequest('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updatePrice: async (id, data) => await apiRequest(`/products/${id}/price`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// REPORT APIs
// ============================================================================

export const reportAPI = {
    getFinancial: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/financial${query ? `?${query}` : ''}`);
    },
    getSalesTrends: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/sales-trends${query ? `?${query}` : ''}`);
    },
    getExpenseBreakdown: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/expense-breakdown${query ? `?${query}` : ''}`);
    },
    getFlockPerformance: async () => await apiRequest('/reports/flock-performance'),
    getEggProduction: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/egg-production${query ? `?${query}` : ''}`);
    },
    getMortality: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/mortality${query ? `?${query}` : ''}`);
    },
    getDashboardAnalytics: async () => await apiRequest('/reports/dashboard-analytics'),
};

// ============================================================================
// WORKER APIs
// ============================================================================

export const workerAPI = {
    getAll: async () => await apiRequest('/workers'),
    getStats: async () => await apiRequest('/workers/stats'),
    getById: async (id) => await apiRequest(`/workers/${id}`),
    create: async (data) => await apiRequest('/workers', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/workers/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// TASK APIs
// ============================================================================

export const taskAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/tasks${query ? `?${query}` : ''}`);
    },
    getStats: async () => await apiRequest('/tasks/stats'),
    getToday: async () => await apiRequest('/tasks/today'),
    create: async (data) => await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    complete: async (id, data = {}) => await apiRequest(`/tasks/${id}/complete`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// NOTIFICATION APIs
// ============================================================================

export const notificationAPI = {
    getAll: async (unreadOnly = false) => await apiRequest(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`),
    getUnreadCount: async () => await apiRequest('/notifications/unread-count'),
    markAsRead: async (id) => await apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: async () => await apiRequest('/notifications/read-all', { method: 'PUT' }),
    delete: async (id) => await apiRequest(`/notifications/${id}`, { method: 'DELETE' }),
    generate: async () => await apiRequest('/notifications/generate', { method: 'POST' }),
};

// ============================================================================
// CALENDAR APIs
// ============================================================================

export const calendarAPI = {
    getEvents: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/calendar${query ? `?${query}` : ''}`);
    },
    getAllScheduled: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/calendar/all${query ? `?${query}` : ''}`);
    },
    create: async (data) => await apiRequest('/calendar', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => await apiRequest(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => await apiRequest(`/calendar/${id}`, { method: 'DELETE' }),
};

// Export default API object
export default {
    auth: authAPI,
    flocks: flockAPI,
    sales: salesAPI,
    inventory: inventoryAPI,
    health: healthAPI,
    expenses: expenseAPI,
    customers: customerAPI,
    dailyLogs: dailyLogAPI,
    vaccinations: vaccinationAPI,
    products: productAPI,
    reports: reportAPI,
    workers: workerAPI,
    tasks: taskAPI,
    notifications: notificationAPI,
    calendar: calendarAPI,
};
