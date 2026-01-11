# Password Reset API Documentation

## Overview

This document describes the password reset functionality implemented in the LocalMind Backend. The system includes two main endpoints for initiating and completing password resets securely.

---

## Features

✅ **Secure Token Generation** - Uses `crypto.randomBytes()` for secure random tokens  
✅ **Token Hashing** - Tokens are hashed with SHA256 before storage  
✅ **Time-Limited Tokens** - Reset tokens expire after 15 minutes  
✅ **Security** - Email existence is never revealed to users  
✅ **Email Notifications** - Beautiful HTML emails with reset links  
✅ **Strong Password Enforcement** - Password must meet strict requirements  
✅ **Atomic Operations** - Token cleared immediately after use  
✅ **User-Safe Error Messages** - No sensitive information in responses  

---

## API Endpoints

### 1. POST /api/auth/forgot-password

**Description:** Initiate password reset process

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent.",
  "data": {}
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Backend Logic:**
1. Validates email format
2. Finds user by email (silently ignores if not found)
3. Generates secure random token (32 bytes = 64 hex chars)
4. Hashes token with SHA256
5. Saves hashed token + 15-minute expiry to database
6. Sends email with reset link containing raw token
7. Always returns success message (doesn't reveal if email exists)

**Security Notes:**
- Token is generated as raw random bytes
- Only the hashed version is stored in database
- If user not found, no error is raised (prevents email enumeration)
- Email sending failures don't break the flow

---

### 2. POST /api/auth/reset-password/:token

**Description:** Complete password reset with valid token

**URL Parameters:**
- `token` (string) - Reset token from email link (required)

**Request Body:**
```json
{
  "password": "NewStrongPassword123"
}
```

**Password Requirements:**
- Minimum 8 characters, maximum 20 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

**Response (Invalid/Expired Token - 401):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Response (Invalid Password - 400):**
```json
{
  "success": false,
  "message": "Password must contain at least one uppercase letter"
}
```

**Backend Logic:**
1. Validates token parameter is provided
2. Validates new password meets requirements
3. Hashes incoming token with SHA256
4. Queries database for matching token + valid expiry
5. If found and valid:
   - Hashes new password with bcrypt (10 salt rounds)
   - Updates user password
   - Clears reset token and expiry (atomic operation)
6. If not found/expired: Returns error without details

**Security Notes:**
- Token must match exactly (hashed comparison)
- Token must not be expired
- New password is hashed before storage
- Token is immediately cleared after successful reset
- Multiple reset attempts with same token fail after first use

---

## Database Schema Changes

### User Model

Added two new fields to the User schema:

```typescript
resetPasswordToken: {
  type: String,
  default: null,
  select: false,  // Not selected by default queries
}
resetPasswordExpire: {
  type: Date,
  default: null,
  select: false,  // Not selected by default queries
}
```

**Notes:**
- Both fields are optional and default to null
- Both fields have `select: false` to exclude them from normal queries (security)
- Must explicitly select them when needed with `.select('+resetPasswordToken +resetPasswordExpire')`

---

## Email Configuration

### Environment Variables Required

```env
# Email Service Selection (gmail or custom SMTP)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@localmind.com

# Frontend URL for reset links
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup

For Gmail with 2FA:
1. Generate an App Password: https://myaccount.google.com/apppasswords
2. Use the generated password in `SMTP_PASSWORD`

Example Gmail config:
```env
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=noreply@localmind.com
FRONTEND_URL=http://localhost:3000
```

### Custom SMTP Server

Example for SendGrid, Mailgun, or other providers:
```env
SMTP_SERVICE=
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxx
SMTP_FROM=noreply@localmind.com
FRONTEND_URL=http://localhost:3000
```

---

## Implementation Details

### Token Generation Flow

```
User clicks "Forgot Password" on Frontend
         ↓
Frontend calls POST /api/auth/forgot-password
         ↓
Backend generates: rawToken = crypto.randomBytes(32).toString('hex')
         ↓
Backend hashes: hashedToken = SHA256(rawToken)
         ↓
Backend saves: { resetPasswordToken: hashedToken, resetPasswordExpire: now + 15min }
         ↓
Backend builds: resetLink = frontend_url + '/reset-password/' + rawToken
         ↓
Backend sends email with resetLink
         ↓
Frontend returns success message (doesn't reveal if email exists)
         ↓
User receives email with reset link
```

### Token Verification Flow

```
User receives email and clicks reset link
         ↓
Frontend navigates to /reset-password/{rawToken}
         ↓
User enters new password
         ↓
Frontend calls POST /api/auth/reset-password/{rawToken}
         ↓
Backend hashes: incomingHashedToken = SHA256(rawToken)
         ↓
Backend queries: User where resetPasswordToken == incomingHashedToken AND resetPasswordExpire > now
         ↓
If found:
  - Hash new password with bcrypt
  - Update user: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpire: null }
  - Return success
         ↓
If not found:
  - Return "Invalid or expired token"
```

---

## Security Considerations

### ✅ Implemented Security Measures

1. **Secure Token Generation**
   - Uses `crypto.randomBytes(32)` - cryptographically secure
   - 64 hexadecimal characters = 256 bits of entropy
   - Impossible to guess or brute force

2. **Token Hashing**
   - Only hashed tokens stored in database
   - If database is breached, tokens cannot be used
   - SHA256 hashing for comparison

3. **Time-Limited Tokens**
   - Expires after 15 minutes
   - Prevents long-term token reuse
   - Timestamp verified on every reset attempt

4. **Email Enumeration Protection**
   - "Forgot password" endpoint always returns success
   - Never reveals if email exists or not
   - Prevents attackers from discovering valid emails

5. **One-Time Use**
   - Token immediately cleared after successful reset
   - Cannot reuse same token twice
   - Prevents token replay attacks

6. **Password Security**
   - Enforced strong password requirements
   - Hashed with bcrypt (10 salt rounds) before storage
   - Meets OWASP password standards

7. **No Sensitive Logging**
   - Tokens never logged in plaintext
   - Errors are user-safe messages
   - Internal errors logged only on server

### ⚠️ Important Security Notes

1. **HTTPS Required in Production**
   - Always use HTTPS in production
   - Reset links contain tokens that must be encrypted in transit
   - Set `SMTP_SECURE=true` for email

2. **Email Service Security**
   - Use strong app passwords (not account password for Gmail)
   - Rotate SMTP credentials regularly
   - Keep SMTP_PASSWORD confidential

3. **Token Storage**
   - Never log reset tokens
   - Don't expose tokens in API responses
   - Only return confirmation, not the token

4. **Frontend Considerations**
   - Store token only in URL, not in localStorage
   - Clear token from URL after successful reset
   - Validate token format before sending

---

## Error Handling

### User-Safe Error Messages

All errors returned to frontend are generic and user-safe:

```typescript
// What user sees:
"Invalid or expired reset token"
"Password must contain at least one uppercase letter"
"If the email exists, a reset link has been sent."

// What server logs (never shown to user):
Error in resetPassword: MongoDB connection error
Error sending email: SMTP timeout
etc.
```

### HTTP Status Codes

| Status | Scenario |
|--------|----------|
| 200 OK | Forgot password initiated, reset successful |
| 400 Bad Request | Invalid email, missing token, invalid password |
| 401 Unauthorized | Invalid or expired token |
| 500 Internal Server Error | Database or email service error |

---

## Testing

### Manual Testing Steps

#### Test 1: Forgot Password Flow
```bash
# 1. Call forgot password endpoint
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected response:
# {
#   "success": true,
#   "message": "If the email exists, a reset link has been sent.",
#   "data": {}
# }

# 2. Check email for reset link (contains token)
# 3. Copy the token from the reset link
```

#### Test 2: Reset Password with Valid Token
```bash
# Use the token from email
curl -X POST http://localhost:5000/api/v1/auth/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password": "NewPassword123@"}'

# Expected response:
# {
#   "success": true,
#   "message": "Password reset successful",
#   "data": {}
# }

# 4. Login with new password to verify
curl -X POST http://localhost:5000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "NewPassword123@"}'
```

#### Test 3: Invalid Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password/invalid_token \
  -H "Content-Type: application/json" \
  -d '{"password": "NewPassword123@"}'

# Expected response:
# {
#   "success": false,
#   "message": "Invalid or expired reset token"
# }
```

#### Test 4: Weak Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password": "weak"}'

# Expected response:
# {
#   "success": false,
#   "message": "Password must be at least 8 characters"
# }
```

---

## Code Structure

### Files Created/Modified

**New Files:**
- `src/services/password-reset.service.ts` - Token and password reset logic
- `src/utils/email.utils.ts` - Email sending utility
- `PASSWORD_RESET_API.md` - This documentation

**Modified Files:**
- `src/api/v1/user/user.model.ts` - Added schema fields
- `src/api/v1/user/user.type.ts` - Added interface properties
- `src/api/v1/user/user.constant.ts` - Added error messages
- `src/api/v1/user/user.controller.ts` - Added forgot/reset methods
- `src/api/v1/user/user.routes.ts` - Added new routes
- `src/api/v1/user/user.validator.ts` - Added validation schemas
- `src/validator/env.ts` - Added email env variables
- `env.example` - Added email configuration examples

### Class Hierarchy

```
EmailService (src/utils/email.utils.ts)
├── sendPasswordResetEmail(email, resetLink)
└── verifyTransporter()

PasswordResetService (src/services/password-reset.service.ts)
├── initiatePasswordReset(email)
├── verifyResetToken(token)
├── resetPassword(token, newPassword)
└── clearResetToken(userId)

UserController (src/api/v1/user/user.controller.ts)
├── forgotPassword(req, res)
├── resetPassword(req, res)
└── ... other methods
```

---

## Troubleshooting

### Email not being sent

1. Check SMTP configuration in `.env`
2. Verify app password for Gmail (if using Gmail)
3. Check firewall/network access to SMTP server
4. Enable "Less secure app access" if using Gmail (not recommended)
5. Check server logs for email service errors

### Token expired too quickly

- Default expiry is 15 minutes
- Adjust `ResetPasswordConfig.expiryMinutes` in `user.constant.ts`
- User should complete reset within the time window

### Password reset fails with "Invalid token"

1. Token may have expired (after 15 minutes)
2. Token may have already been used
3. Token may have been modified in transit
4. Ensure HTTPS is used in production

### Reset link not working from email

1. Check `FRONTEND_URL` environment variable
2. Ensure frontend can be accessed from user's browser
3. Verify token is not being double-encoded in email link
4. Test with direct URL instead of email link

---

## Future Enhancements

- [ ] Rate limiting on forgot password endpoint (prevent spam)
- [ ] Resend functionality for expired tokens
- [ ] Password reset history/audit trail
- [ ] IP-based reset confirmations
- [ ] Two-factor authentication requirement
- [ ] Webhook notifications for failed reset attempts
- [ ] SMS backup reset method

---

## References

- OWASP Password Reset: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Node.js Crypto: https://nodejs.org/api/crypto.html
- bcrypt: https://github.com/kelektiv/node.bcrypt.js
- Nodemailer: https://nodemailer.com/

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Maintainer:** LocalMind Development Team
