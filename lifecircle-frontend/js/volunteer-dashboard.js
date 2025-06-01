// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'volunteer') {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    loadUserData();
    // Load available requests by default
    loadAvailableRequests();
}

// Load User Data
function loadUserData() {
    $.ajax({
        url: `${API_BASE_URL}/auth/me`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            $('#userName').text(response.name);
            // Load profile data if exists
            loadProfile();
        },
        error: function() {
            handleLogout();
        }
    });
}

// Load Profile
function loadProfile() {
    $.ajax({
        url: `${API_BASE_URL}/volunteers/profile`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            // Populate profile form
            $('#skills').val(response.skills);
            $('#preferredLocations').val(response.preferredLocations.join(', '));
            $('#bio').val(response.bio);
        },
        error: function() {
            // Profile might not exist yet
        }
    });
}

// Load Available Requests
function loadAvailableRequests() {
    $('#contentTitle').text('Available Requests');
    $('.list-group-item').removeClass('active');
    $('.list-group-item:first').addClass('active');

    $.ajax({
        url: `${API_BASE_URL}/requests/available`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            displayAvailableRequests(response);
        },
        error: function(xhr) {
            alert('Failed to load requests: ' + (xhr.responseJSON?.message || 'Please try again'));
        }
    });
}

// Load My Assignments
function loadMyAssignments() {
    $('#contentTitle').text('My Assignments');
    $('.list-group-item').removeClass('active');
    $('.list-group-item:eq(1)').addClass('active');

    $.ajax({
        url: `${API_BASE_URL}/requests/my-assignments`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(response) {
            displayMyAssignments(response);
        },
        error: function(xhr) {
            alert('Failed to load assignments: ' + (xhr.responseJSON?.message || 'Please try again'));
        }
    });
}

// Display Available Requests
function displayAvailableRequests(requests) {
    const requestsList = $('#requestsList');
    requestsList.empty();

    if (requests.length === 0) {
        requestsList.html('<p class="text-muted">No available requests found.</p>');
        return;
    }

    requests.forEach(request => {
        const requestCard = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${request.taskType}</h5>
                        <span class="badge bg-warning">Available</span>
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
                    <div class="mt-3">
                        <button class="btn btn-primary btn-sm" onclick="assignToRequest('${request._id}')">
                            Assign to Me
                        </button>
                    </div>
                </div>
            </div>
        `;
        requestsList.append(requestCard);
    });
}

// Display My Assignments
function displayMyAssignments(assignments) {
    const requestsList = $('#requestsList');
    requestsList.empty();

    if (assignments.length === 0) {
        requestsList.html('<p class="text-muted">No assignments found.</p>');
        return;
    }

    assignments.forEach(assignment => {
        const statusClass = getStatusClass(assignment.status);
        const requestCard = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${assignment.taskType}</h5>
                        <span class="badge ${statusClass}">${assignment.status}</span>
                    </div>
                    <p class="card-text">${assignment.description}</p>
                    <div class="row">
                        <div class="col-md-4">
                            <small class="text-muted">Location: ${assignment.location}</small>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">Time: ${new Date(assignment.scheduledTime).toLocaleString()}</small>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">Duration: ${assignment.duration} hours</small>
                        </div>
                    </div>
                    ${assignment.status !== 'completed' ? `
                        <div class="mt-3">
                            <button class="btn btn-outline-primary btn-sm" onclick="showUpdateStatusModal('${assignment._id}')">
                                Update Status
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
        case 'in_progress':
            return 'bg-info';
        case 'completed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Assign to Request
function assignToRequest(requestId) {
    $.ajax({
        url: `${API_BASE_URL}/requests/${requestId}/assign`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function() {
            loadAvailableRequests();
            alert('Successfully assigned to request!');
        },
        error: function(xhr) {
            alert('Failed to assign request: ' + (xhr.responseJSON?.message || 'Please try again'));
        }
    });
}

// Show Update Status Modal
function showUpdateStatusModal(requestId) {
    $('#requestId').val(requestId);
    $('#updateStatusModal').modal('show');
}

// Handle Profile Update
$('#profileForm').on('submit', function(e) {
    e.preventDefault();

    const profileData = {
        skills: $('#skills').val(),
        preferredLocations: $('#preferredLocations').val().split(',').map(loc => loc.trim()),
        bio: $('#bio').val()
    };

    // Handle file upload if selected
    const fileInput = $('#backgroundCheck')[0];
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('document', fileInput.files[0]);
        
        // Upload file first
        $.ajax({
            url: `${API_BASE_URL}/volunteers/background-check`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                profileData.documentUrl = response.documentUrl;
                updateProfile(profileData);
            },
            error: function(xhr) {
                alert('Failed to upload document: ' + (xhr.responseJSON?.message || 'Please try again'));
            }
        });
    } else {
        updateProfile(profileData);
    }
});

// Update Profile
function updateProfile(profileData) {
    $.ajax({
        url: `${API_BASE_URL}/volunteers/profile`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(profileData),
        success: function() {
            $('#profileModal').modal('hide');
            alert('Profile updated successfully!');
        },
        error: function(xhr) {
            alert('Failed to update profile: ' + (xhr.responseJSON?.message || 'Please try again'));
        }
    });
}

// Handle Status Update
$('#updateStatusForm').on('submit', function(e) {
    e.preventDefault();

    const requestId = $('#requestId').val();
    const statusData = {
        status: $('#status').val(),
        completionNotes: $('#completionNotes').val()
    };

    $.ajax({
        url: `${API_BASE_URL}/requests/${requestId}/status`,
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(statusData),
        success: function() {
            $('#updateStatusModal').modal('hide');
            loadMyAssignments();
            alert('Status updated successfully!');
        },
        error: function(xhr) {
            alert('Failed to update status: ' + (xhr.responseJSON?.message || 'Please try again'));
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