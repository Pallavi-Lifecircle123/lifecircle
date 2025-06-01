// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Handle Login
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        email: $(this).find('[name="email"]').val(),
        password: $(this).find('[name="password"]').val(),
        userType: $(this).find('[name="userType"]').val()
    };

    // Basic validation
    if (!formData.email || !formData.password || !formData.userType) {
        alert('Please fill in all fields');
        return;
    }

    $.ajax({
        url: `${API_BASE_URL}/auth/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            // Store token and user type
            localStorage.setItem('token', response.token);
            localStorage.setItem('userType', formData.userType);
            
            // Redirect based on user type
            if (formData.userType === 'elder') {
                window.location.href = 'elder-dashboard.html';
            } else {
                window.location.href = 'volunteer-dashboard.html';
            }
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.message || 'Login failed. Please try again.');
        }
    });
});

// Handle Registration
$('#registerForm').on('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: $(this).find('[name="name"]').val(),
        email: $(this).find('[name="email"]').val(),
        password: $(this).find('[name="password"]').val(),
        phone: $(this).find('[name="phone"]').val(),
        userType: $(this).find('[name="userType"]').val()
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.userType) {
        alert('Please fill in all fields');
        return;
    }

    $.ajax({
        url: `${API_BASE_URL}/auth/register`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            alert('Registration successful! Please login.');
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.message || 'Registration failed. Please try again.');
        }
    });
});

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
    window.location.href = 'index.html';
}

// Initialize
$(document).ready(function() {
    checkAuth();
}); 