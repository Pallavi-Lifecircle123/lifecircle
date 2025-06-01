// API Configuration
window.API_CONFIG = {
    BASE_URL: 'https://api.lifecircle.ca/api',  // Production API URL
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    CREDENTIALS: 'include',
    DEBUG: true
};

// Environment Configuration
window.ENV = {
    FRONTEND_URL: 'https://beta.thelifecircle.ca',
    API_URL: 'https://api.lifecircle.ca',
    ENVIRONMENT: 'production'
};

// Theme Configuration
window.THEME = {
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
window.TASK_TYPES = {
    COMPANIONSHIP: 'companionship',
    TECH_SUPPORT: 'tech_support',
    TRANSPORTATION: 'transportation',
    PERSONAL_CARE: 'personal_care'
};

// Request Status
window.REQUEST_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// User Roles
window.USER_ROLES = {
    ELDER: 'elder',
    VOLUNTEER: 'volunteer',
    ADMIN: 'admin'
}; 