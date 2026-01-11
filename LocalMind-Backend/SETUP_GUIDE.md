# Password Reset Implementation - Setup & Integration Guide

## Quick Start

### 1. Environment Setup

Add these variables to your `.env` file:

```env
# Frontend URL (used in reset email links)
FRONTEND_URL=http://localhost:3000

# Email Service Configuration (choose one option below)

# Option A: Gmail with App Password
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=noreply@localmind.com

# Option B: Custom SMTP Server
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@localmind.com
```

### 2. Gmail Setup (Recommended)

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Copy the generated 16-character password
4. Paste into `.env` as `SMTP_PASSWORD`

### 3. Verify Installation

All dependencies are already installed:
- ✅ `nodemailer` - Email sending
- ✅ `bcrypt` - Password hashing
- ✅ `crypto` - Token generation (Node.js built-in)

### 4. Database Migration

The User schema is automatically updated with:
```typescript
resetPasswordToken: String | null
resetPasswordExpire: Date | null
```

No database migration needed if using MongoDB with Mongoose.

---

## API Usage

### Frontend Integration

#### 1. Forgot Password Page

```html
<form id="forgotPasswordForm">
  <input type="email" id="email" placeholder="Enter your email" required />
  <button type="submit">Send Reset Link</button>
</form>

<script>
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  
  try {
    const response = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    // Always shows success message - doesn't reveal if email exists
    alert('If the email exists, a reset link has been sent.');
    
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
</script>
```

#### 2. Reset Password Page

```html
<form id="resetPasswordForm">
  <input 
    type="password" 
    id="password" 
    placeholder="New Password (min 8 chars, 1 uppercase, 1 number, 1 special char)"
    required 
  />
  <button type="submit">Reset Password</button>
</form>

<script>
// Extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = new URL(window.location).pathname.split('/').pop(); // or from URL

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`/api/v1/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Password reset successful! You can now login with your new password.');
      window.location.href = '/login';
    } else {
      alert(data.message); // Show error message
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
</script>
```

---

## Testing

### Using cURL

#### Test 1: Request Password Reset
```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Response:
# {
#   "success": true,
#   "message": "If the email exists, a reset link has been sent.",
#   "data": {}
# }
```

#### Test 2: Reset Password
```bash
# Use the token from the email link you received
TOKEN="your-token-from-email"

curl -X POST http://localhost:5000/api/v1/auth/reset-password/$TOKEN \
  -H "Content-Type: application/json" \
  -d '{"password": "NewPassword123@"}'

# Response:
# {
#   "success": true,
#   "message": "Password reset successful",
#   "data": {}
# }
```

#### Test 3: Login with New Password
```bash
curl -X POST http://localhost:5000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "NewPassword123@"}'

# Response should contain token and user data
```

### Using Postman

1. **Create Forgot Password Request**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/forgot-password`
   - Body (raw JSON):
     ```json
     {"email": "test@example.com"}
     ```

2. **Create Reset Password Request**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/reset-password/{{token}}`
   - Body (raw JSON):
     ```json
     {"password": "NewPassword123@"}
     ```
   - Replace `{{token}}` with the token from email

---

## Security Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Set strong `SERVER_HMAC_SECRET` in `.env`
- [ ] Configure SMTP with real email service
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Enable HTTPS (required for production)
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your frontend domain
- [ ] Regularly rotate SMTP credentials
- [ ] Monitor failed reset attempts
- [ ] Set up email rate limiting (recommended)

---

## File Structure

```
LocalMind-Backend/
├── src/
│   ├── api/
│   │   └── v1/
│   │       └── user/
│   │           ├── user.model.ts (✏️ MODIFIED - added reset fields)
│   │           ├── user.type.ts (✏️ MODIFIED - added interface)
│   │           ├── user.constant.ts (✏️ MODIFIED - added messages)
│   │           ├── user.controller.ts (✏️ MODIFIED - added methods)
│   │           ├── user.routes.ts (✏️ MODIFIED - added endpoints)
│   │           └── user.validator.ts (✏️ MODIFIED - added schemas)
│   ├── services/
│   │   └── password-reset.service.ts (✨ NEW)
│   ├── utils/
│   │   ├── email.utils.ts (✨ NEW)
│   │   └── SendResponse.utils.ts
│   ├── constant/
│   │   └── env.constant.ts
│   ├── validator/
│   │   └── env.ts (✏️ MODIFIED - added email vars)
│   └── ...
├── tsconfig.json (✏️ MODIFIED - added Node types)
├── PASSWORD_RESET_API.md (✨ NEW - Full documentation)
└── ...
```

---

## Debugging

### Email not sending?

1. Check email configuration in `.env`
2. For Gmail: Use App Password, not regular password
3. Check server logs:
   ```bash
   npm run dev
   ```
4. Verify email service is accessible from your network
5. Check email in spam/junk folder

### Token invalid/expired?

1. Token expires after 15 minutes
2. User must complete reset within this time
3. Token can only be used once

### Password not meeting requirements?

Password must have:
- 8-20 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

---

## Customization

### Change Token Expiry Time

Edit `src/api/v1/user/user.constant.ts`:

```typescript
export const ResetPasswordConfig = {
  tokenLength: 32,
  expiryMinutes: 15, // ← Change this value
}
```

### Change Email Template

Edit `src/utils/email.utils.ts`, modify the `htmlContent` in `sendPasswordResetEmail()` method.

### Add Rate Limiting

```typescript
// In user.routes.ts
import rateLimit from 'express-rate-limit';

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per 15 minutes
  message: 'Too many password reset requests, please try again later.'
});

router.post('/v1/auth/forgot-password', forgotPasswordLimiter, userController.forgotPassword);
```

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## Support

For issues or questions:

1. Check `PASSWORD_RESET_API.md` for detailed documentation
2. Review error messages in server logs
3. Verify environment variables are set correctly
4. Test with cURL before integrating into frontend

---

**Version:** 1.0  
**Last Updated:** January 2025
