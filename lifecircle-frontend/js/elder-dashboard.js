// Remove the hardcoded API_BASE_URL and use the one from config.js
// const API_BASE_URL = 'http://localhost:3000/api';

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'elder') {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    loadUserData();
    // Load requests
    loadMyRequests();
}

// Load User Data
function loadUserData() {
    $.ajax({
        url: `${window.API_CONFIG.BASE_URL}/auth/me`,
        method: 'GET',
        headers: {
            ...window.API_CONFIG.HEADERS,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            $('#userName').text(response.name);
        },
        error: function() {
            handleLogout();
        }
    });
}

// Load My Requests
function loadMyRequests() {
    $.ajax({
        url: `${window.API_CONFIG.BASE_URL}/requests/my-requests`,
        method: 'GET',
        headers: {
            ...window.API_CONFIG.HEADERS,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            displayRequests(response);
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.message || 'Failed to load requests');
        }
    });
}

// Display Requests
function displayRequests(requests) {
    const requestsList = $('#requestsList');
    requestsList.empty();

    if (requests.length === 0) {
        requestsList.html('<p class="text-muted">No requests found.</p>');
        return;
    }

    requests.forEach(request => {
        const statusClass = getStatusClass(request.status);
        const requestCard = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${request.taskType}</h5>
                        <span class="badge ${statusClass}">${request.status}</span>
                    </div>
                    <p class="card-text">${request.description}</p>
                    <div class="row">
                        <div class="col-md-4">
                            <small class="text-muted">Location: ${request.location}</small>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">Time: ${new Date(request.scheduledTime).toLocaleString()}</small>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">Duration: ${request.duration} hours</small>
                        </div>
                    </div>
                    ${request.status === 'completed' ? `
                        <div class="mt-3">
                            <button class="btn btn-outline-primary btn-sm" onclick="showFeedbackModal('${request._id}')">
                                Provide Feedback
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        requestsList.append(requestCard);
    });
}

// Get Status Class
function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning';
        case 'assigned':
            return 'bg-info';
        case 'completed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Handle Create Request
$('#createRequestForm').on('submit', function(e) {
    e.preventDefault();

    const requestData = {
        taskType: $('#taskType').val(),
        description: $('#description').val(),
        location: $('#location').val(),
        scheduledTime: $('#scheduledTime').val(),
        duration: parseInt($('#duration').val())
    };

    $.ajax({
        url: `${window.API_CONFIG.BASE_URL}/requests`,
        method: 'POST',
        headers: {
            ...window.API_CONFIG.HEADERS,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: JSON.stringify(requestData),
        success: function() {
            $('#createRequestModal').modal('hide');
            loadMyRequests();
            $('#createRequestForm')[0].reset();
        },
        error: function(xhr) {
            alert('Failed to create request: ' + (xhr.responseJSON?.message || 'Please try again'));
        }
    });
});

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}

// Document Ready
$(document).ready(function() {
    checkAuth();
}); 