// API Configuration
const API_CONFIG = {
    BASE_URL: process.env.API_URL || 'http://localhost:3000/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
    }
};

// Theme Configuration
const THEME = {
    COLORS: {
        PRIMARY: '#4A90E2',      // Main brand color
        SECONDARY: '#50C878',    // Success/positive actions
        ACCENT: '#FFB74D',       // Warning/attention
        DARK: '#333333',         // Text color
        LIGHT: '#F5F5F5',        // Background color
        WHITE: '#FFFFFF',
        GRAY: '#666666'
    },
    FONTS: {
        PRIMARY: 'Inter, Arial, sans-serif',
        SECONDARY: 'Roboto, Arial, sans-serif'
    },
    BREAKPOINTS: {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024
    }
};

// Task Types
const TASK_TYPES = {
    COMPANIONSHIP: 'companionship',
    TECH_SUPPORT: 'tech_support',
    TRANSPORTATION: 'transportation',
    PERSONAL_CARE: 'personal_care'
};

// Request Status
const REQUEST_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// User Roles
const USER_ROLES = {
    ELDER: 'elder',
    VOLUNTEER: 'volunteer',
    ADMIN: 'admin'
}; 