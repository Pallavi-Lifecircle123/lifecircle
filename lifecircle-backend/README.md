# Life Circle Backend API Documentation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### 1. Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user (elder, volunteer, or admin)
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123",
    "role": "elder", // or "volunteer" or "admin"
    "name": "John Doe",
    "phone": "1234567890",
    "address": "123 Main St"
}
```

#### 2. Login
- **POST** `/api/auth/login`
- **Description**: Login user and get JWT token
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### 3. Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`

#### 4. Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

### Requests

#### 1. Create Request (Elder)
- **POST** `/api/requests`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "taskType": "companionship",
    "description": "Need someone to chat and play cards",
    "location": "Downtown",
    "scheduledTime": "2024-03-20T14:00:00Z",
    "duration": 2
}
```

#### 2. Get Elder's Requests
- **GET** `/api/requests/my-requests`
- **Headers**: `Authorization: Bearer <token>`

#### 3. Get Available Requests (Volunteer)
- **GET** `/api/requests/available`
- **Headers**: `Authorization: Bearer <token>`

#### 4. Assign to Request (Volunteer)
- **POST** `/api/requests/:requestId/assign`
- **Headers**: `Authorization: Bearer <token>`

#### 5. Update Request Status
- **PATCH** `/api/requests/:requestId/status`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "status": "completed",
    "completionNotes": "Great session, played cards and had tea"
}
```

#### 6. Add Feedback (Elder)
- **POST** `/api/requests/:requestId/feedback`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "rating": 5,
    "comment": "Excellent service, very friendly and helpful"
}
```

### Volunteer Profile

#### 1. Create/Update Profile
- **POST** `/api/volunteers/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "skills": ["companionship", "tech_support"],
    "availability": [
        {
            "day": "monday",
            "startTime": "09:00",
            "endTime": "17:00"
        }
    ],
    "preferredLocations": ["Downtown", "West Side"],
    "bio": "Experienced volunteer with passion for helping others"
}
```

#### 2. Get Profile
- **GET** `/api/volunteers/profile`
- **Headers**: `Authorization: Bearer <token>`

#### 3. Upload Background Check
- **POST** `/api/volunteers/background-check`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "documentUrl": "https://example.com/document.pdf"
}
```

#### 4. Get Volunteer Stats
- **GET** `/api/volunteers/stats`
- **Headers**: `Authorization: Bearer <token>`

#### 5. Update Background Check Status (Admin)
- **PATCH** `/api/volunteers/:volunteerId/background-check`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "status": "approved"
}
```

## Postman Testing Guide

### Setup Postman Collection

1. Create a new collection called "Life Circle API"
2. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `elder_token`: (leave empty)
   - `volunteer_token`: (leave empty)
   - `admin_token`: (leave empty)

### Testing Flow

1. **Register Users**
   - Register an elder
   - Register a volunteer
   - Register an admin
   - Save their tokens in environment variables

2. **Test Elder Flow**
   - Create a request
   - View their requests
   - Add feedback to completed requests

3. **Test Volunteer Flow**
   - Create/update profile
   - View available requests
   - Assign to a request
   - Update request status
   - View stats

4. **Test Admin Flow**
   - Update volunteer background check status

### Example Test Cases

1. **Register Elder**
```http
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
    "email": "elder@example.com",
    "password": "password123",
    "role": "elder",
    "name": "John Elder",
    "phone": "1234567890",
    "address": "123 Elder St"
}
```

2. **Login and Save Token**
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "elder@example.com",
    "password": "password123"
}
```
- Save the token from response to `elder_token`

3. **Create Request**
```http
POST {{base_url}}/api/requests
Authorization: Bearer {{elder_token}}
Content-Type: application/json

{
    "taskType": "companionship",
    "description": "Need someone to chat and play cards",
    "location": "Downtown",
    "scheduledTime": "2024-03-20T14:00:00Z",
    "duration": 2
}
```

### Common Test Scenarios

1. **Complete Request Flow**
   - Elder creates request
   - Volunteer views available requests
   - Volunteer assigns to request
   - Volunteer updates status to completed
   - Elder provides feedback

2. **Profile Management**
   - Volunteer creates profile
   - Admin reviews background check
   - Volunteer views stats

3. **Authentication Tests**
   - Try accessing protected routes without token
   - Try accessing admin routes with non-admin token
   - Test token expiration

### Error Cases to Test

1. Invalid credentials
2. Missing required fields
3. Invalid role access
4. Invalid request status transitions
5. Duplicate email registration
6. Invalid date formats
7. Missing authorization headers

## Troubleshooting

1. **MongoDB Connection Issues**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check network connectivity

2. **Authentication Issues**
   - Verify token format
   - Check token expiration
   - Ensure correct role permissions

3. **Request Validation**
   - Check required fields
   - Verify date formats
   - Validate enum values

4. **Server Issues**
   - Check server logs
   - Verify port availability
   - Check environment variables 