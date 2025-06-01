// Remove the hardcoded API_BASE_URL and use the one from config.js
// const API_BASE_URL = 'http://localhost:3000/api';

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const userType = $('#loginUserType').val();
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (window.API_CONFIG.DEBUG) {
        console.log('Attempting login with:', { email, userType });
    }
    
    // Make API call
    $.ajax({
        url: `${window.API_CONFIG.BASE_URL}/auth/login`,
        method: 'POST',
        headers: window.API_CONFIG.HEADERS,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            email,
            password,
            user_type: userType
        }),
        beforeSend: function(xhr) {
            if (window.API_CONFIG.DEBUG) {
                console.log('Sending login request to:', `${window.API_CONFIG.BASE_URL}/auth/login`);
                console.log('Request headers:', xhr.getAllResponseHeaders());
            }
        },
        success: function(response) {
            if (window.API_CONFIG.DEBUG) {
                console.log('Login successful:', response);
            }
            // Store token and user type
            localStorage.setItem('token', response.token);
            localStorage.setItem('userType', userType);
            
            // Redirect based on user type
            if (userType === 'elder') {
                window.location.href = `${window.ENV.FRONTEND_URL}/elder-dashboard.html`;
            } else {
                window.location.href = `${window.ENV.FRONTEND_URL}/volunteer-dashboard.html`;
            }
        },
        error: function(xhr, status, error) {
            console.error('Login error details:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText,
                error: error
            });

            if (xhr.status === 0) {
                alert('Unable to connect to the server. Please check your internet connection.');
            } else if (xhr.status === 401) {
                alert('Invalid email or password');
            } else if (xhr.status === 403) {
                alert('Access denied. Please check your credentials.');
            } else if (xhr.status === 404) {
                alert('API endpoint not found. Please contact support.');
            } else {
                alert(xhr.responseJSON?.message || 'Login failed. Please try again.');
            }
        }
    });
}

// Handle URL Parameters
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('userType');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const phone = urlParams.get('phone');
    const password = urlParams.get('password');

    if (userType && name && email && phone && password) {
        // Auto-fill the registration form
        $('#registerUserType').val(userType);
        $('#registerName').val(name);
        $('#registerEmail').val(email);
        $('#registerPhone').val(phone);
        $('#registerPassword').val(password);
        
        // Show registration modal
        $('#registerModal').modal('show');
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    const phone = $('#registerPhone').val();
    const userType = $('#registerUserType').val();
    
    if (window.API_CONFIG.DEBUG) {
        console.log('Register form field values:', {
            name: name,
            email: email,
            password: password,
            phone: phone,
            userType: userType
        });
    }

    // Basic validation
    if (!name || !email || !password || !phone || !userType) {
        alert('Please fill in all fields');
        return;
    }

    if (window.API_CONFIG.DEBUG) {
        console.log('Attempting registration with:', { name, email, userType });
    }
    
    // Make API call
    $.ajax({
        url: `${window.API_CONFIG.BASE_URL}/auth/register`,
        method: 'POST',
        headers: window.API_CONFIG.HEADERS,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            name,
            email,
            password,
            phone,
            user_type: userType
        }),
        beforeSend: function(xhr) {
            if (window.API_CONFIG.DEBUG) {
                console.log('Sending registration request to:', `${window.API_CONFIG.BASE_URL}/auth/register`);
                console.log('Request headers:', xhr.getAllResponseHeaders());
            }
        },
        success: function(response) {
            if (window.API_CONFIG.DEBUG) {
                console.log('Registration successful:', response);
            }
            alert('Registration successful! Please login.');
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
            
            // Auto-fill login form
            $('#loginEmail').val(email);
            $('#loginPassword').val(password);
            $('#loginUserType').val(userType);
        },
        error: function(xhr, status, error) {
            console.error('Registration error details:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText,
                error: error
            });

            if (xhr.status === 0) {
                alert('Unable to connect to the server. Please check your internet connection.');
            } else if (xhr.status === 409) {
                alert('Email already registered');
            } else if (xhr.status === 403) {
                alert('Access denied. Please try again.');
            } else if (xhr.status === 404) {
                alert('API endpoint not found. Please contact support.');
            } else {
                alert(xhr.responseJSON?.message || 'Registration failed. Please try again.');
            }
        }
    });
}

// Check Authentication Status
function checkAuth() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
        // Update UI for logged-in state
        $('.nav-link').hide();
        $('.navbar-nav').append(`
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="handleLogout()">Logout</a>
            </li>
        `);
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = `${window.ENV.FRONTEND_URL}/index.html`;
}

// Initialize
$(document).ready(function() {
    checkAuth();
    handleUrlParameters();
    
    // Add form submit handlers
    $('#registerForm').on('submit', handleRegister);
    $('#loginForm').on('submit', handleLogin);
}); 