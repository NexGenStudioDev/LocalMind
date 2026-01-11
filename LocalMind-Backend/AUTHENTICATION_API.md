# LocalMind Backend - Authentication API

## Overview

The LocalMind Backend provides comprehensive authentication endpoints including user registration, login, and password reset functionality.

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/v1/auth/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "email": "john@example.com",
  "password": "SecurePass123@",
  "birthPlace": "New York",
  "location": "New York, USA",
  "role": "user",
  "portfolioUrl": "https://example.com/portfolio",
  "bio": "Passionate developer"
}
```

**Password Requirements:**
- 8-20 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userObj": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "email": "john@example.com",
      "role": "user",
      "birthPlace": "New York",
      "location": "New York, USA",
      "portfolioUrl": "https://example.com/portfolio",
      "bio": "Passionate developer",
      "createdAt": "2025-01-11T10:00:00Z",
      "updatedAt": "2025-01-11T10:00:00Z"
    }
  }
}
```

---

### 2. User Login

**Endpoint:** `POST /api/v1/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123@"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Description:** Initiate password reset process. Sends email with reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent.",
  "data": {}
}
```

**Security Note:** Always returns success message even if email doesn't exist (prevents email enumeration)

---

### 4. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password/:token`

**Description:** Complete password reset using token from email link.

**URL Parameters:**
- `token` - Reset token received in email (required)

**Request Body:**
```json
{
  "password": "NewSecurePass456@"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

### 5. Get User Profile

**Endpoint:** `GET /api/v1/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "user",
    "birthPlace": "New York",
    "location": "New York, USA"
  }
}
```

---

### 6. Generate API Key

**Endpoint:** `GET /api/v1/auth/apiKey/generate`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API key generated successfully",
  "data": {
    "apiKey": "sk_live_4eC39HqLyjWDarhtT658w35..."
  }
}
```

---

### 7. Get API Key (Masked)

**Endpoint:** `GET /api/v1/auth/apiKey`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API key fetched successfully",
  "data": {
    "apiKey": "sk_l****rq**"
  }
}
```

---

## Authentication Flow

### Registration Flow
```
1. User submits registration form
2. Backend validates all fields
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates user in database
6. Generates JWT token
7. Returns user data and token
```

### Login Flow
```
1. User submits email and password
2. Backend finds user by email
3. Compares password with hash
4. Validates password match
5. Generates JWT token
6. Returns user data and token
7. Token set in cookie and header
```

### Password Reset Flow
```
1. User requests password reset
2. Backend generates secure token
3. Hashes token (SHA256)
4. Saves to database (15 min expiry)
5. Sends email with reset link
6. Returns success (no email enumeration)
7. User clicks link and enters new password
8. Backend validates token and expiry
9. Hashes new password (bcrypt)
10. Updates database
11. Clears reset token
12. Returns success
```

---

## Security Considerations

### Tokens
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRATION`)
- Tokens stored in httpOnly cookies (secure from XSS)
- Tokens validated on every protected request

### Passwords
- Minimum 8, maximum 20 characters
- Must contain uppercase, lowercase, number, special character
- Hashed with bcrypt (10 salt rounds)
- Never logged or transmitted in plaintext

### Reset Tokens
- Generated with 256 bits of entropy
- Hashed with SHA256 before storage
- Expire after 15 minutes
- One-time use only
- Never sent back to client after creation

### Email Privacy
- Forgot password endpoint doesn't reveal if email exists
- Prevents account enumeration attacks
- Always returns success message

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong, please try again later"
}
```

---

## Testing

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "email": "john@example.com",
    "password": "SecurePass123@",
    "birthPlace": "New York",
    "location": "New York, USA"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123@"
  }'
```

#### Forgot Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

#### Reset Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password": "NewSecurePass456@"}'
```

#### Get Profile
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRATION=7d

# Email Configuration (for password reset)
FRONTEND_URL=http://localhost:3000
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM=noreply@localmind.com

# Database
DB_CONNECTION_STRING=mongodb://user:password@localhost:27017/localmind

# Server
NODE_ENV=development
PORT=5000
```

---

## File Structure

```
src/api/v1/user/
├── user.controller.ts      # Request handlers
├── user.routes.ts          # API routes
├── user.model.ts           # Mongoose schema
├── user.type.ts            # TypeScript interfaces
├── user.service.ts         # Business logic
├── user.utils.ts           # Helper functions
├── user.validator.ts       # Zod validation schemas
├── user.constant.ts        # Constants and config
├── user.middleware.ts      # Authentication middleware
└── __test__/               # Tests

src/services/
└── password-reset.service.ts  # Password reset logic

src/utils/
├── email.utils.ts          # Email sending
└── SendResponse.utils.ts   # Response formatting
```

---

## Related Documentation

- [Password Reset API](./PASSWORD_RESET_API.md) - Detailed password reset documentation
- [Setup Guide](./SETUP_GUIDE.md) - Setup and integration instructions
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Feature implementation details

---

## Support

For issues or questions, refer to the detailed documentation files or check the server logs.

---

**Version:** 1.0  
**Last Updated:** January 11, 2025
