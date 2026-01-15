# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Application                      │
│  (React/Vue/Angular - User Interface)                            │
└────────────────┬────────────────────────────────────┬────────────┘
                 │                                    │
                 ▼                                    ▼
        ┌──────────────────┐            ┌──────────────────────┐
        │ Forgot Password  │            │ Reset Password       │
        │ Page             │            │ Page                 │
        │ /forgot-pwd      │            │ /reset-password/:id  │
        └────────┬─────────┘            └──────────┬───────────┘
                 │                                  │
                 ▼                                  ▼
    ┌──────────────────────────────────────────────────────────┐
    │              API Requests (HTTPS)                         │
    │  POST /api/v1/auth/forgot-password                        │
    │  POST /api/v1/auth/reset-password/:token                  │
    └────────┬─────────────────────────────────────────┬────────┘
             │                                        │
             ▼                                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │           Backend Express Server                        │
    │                                                         │
    │  ┌─────────────────────────────────────────────────┐   │
    │  │  Routes (user.routes.ts)                        │   │
    │  │  ├─ POST /auth/forgot-password                  │   │
    │  │  └─ POST /auth/reset-password/:token            │   │
    │  └────────────┬────────────────────────────────────┘   │
    │               │                                         │
    │  ┌────────────▼────────────────────────────────────┐   │
    │  │  Controller (user.controller.ts)                │   │
    │  │  ├─ forgotPassword(req, res)                    │   │
    │  │  └─ resetPassword(req, res)                     │   │
    │  └────────────┬─────────────────────────────────────┘   │
    │               │                                         │
    │  ┌────────────▼────────────────────────────────────┐   │
    │  │  Validation (user.validator.ts)                 │   │
    │  │  ├─ forgotPasswordSchema                        │   │
    │  │  └─ resetPasswordSchema                         │   │
    │  └────────────┬─────────────────────────────────────┘   │
    │               │                                         │
    │      ┌────────┴──────────┬─────────────────┐            │
    │      │                   │                 │            │
    │      ▼                   ▼                 ▼            │
    │  ┌─────────┐    ┌──────────────┐    ┌──────────────┐  │
    │  │ Email   │    │ Password     │    │ Database     │  │
    │  │ Service │    │ Reset        │    │ Operations   │  │
    │  │ Utility │    │ Service      │    │              │  │
    │  │         │    │              │    │              │  │
    │  │ ├─ Send │    │ ├─ Generate  │    │ ├─ Update    │  │
    │  │ │ Email │    │ │ Token      │    │ │ Password   │  │
    │  │ │       │    │ │            │    │ │            │  │
    │  │ ├─ HTML │    │ ├─ Hash      │    │ ├─ Clear     │  │
    │  │ │ Email │    │ │ Token      │    │ │ Reset      │  │
    │  │ │       │    │ │            │    │ │ Fields     │  │
    │  │ └─ Send │    │ └─ Verify    │    │ └─ Retrieve  │  │
    │  │   Link │    │   Token      │    │   User       │  │
    │  └─────────┘    └──────────────┘    └──────────────┘  │
    │       │                │                   │            │
    └───────┼────────────────┼───────────────────┼────────────┘
            │                │                   │
            ▼                │                   ▼
    ┌──────────────┐         │         ┌────────────────────┐
    │  SMTP Server │         │         │  MongoDB Database  │
    │              │         │         │                    │
    │ • Gmail      │         │         │ ├─ User Collection │
    │ • Custom     │         │         │ │ ├─ password      │
    │   SMTP       │         │         │ │ ├─ reset Token   │
    │              │         │         │ │ └─ reset Expire  │
    │              │         │         │ └─────────────────┘
    └──────────────┘         │         └────────────────────┘
                             │
                    ┌────────▼──────────┐
                    │ Email Response    │
                    │ (Success/Error)   │
                    └───────────────────┘
```

---

## Forgot Password Flow

```
User Initiates Password Reset
        │
        ▼
┌──────────────────────────────┐
│ POST /api/auth/forgot-password│
│ { email: "user@example.com" } │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Validate Email Format             │
│ (Zod Schema Validation)           │
└────────────┬─────────────────────┘
             │
             ├─ Invalid → Return 400 Error
             │
             ▼
┌──────────────────────────────────┐
│ Find User by Email               │
│ (Case-insensitive search)         │
└────────────┬─────────────────────┘
             │
             ├─ Not Found → Still return success (security)
             │
             ▼
┌──────────────────────────────────────────┐
│ Generate Secure Reset Token              │
│ token = crypto.randomBytes(32).hex()    │
│ Result: 64 character hex string          │
└────────────┬──────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Hash Token                           │
│ hashedToken = SHA256(token)         │
└────────────┬────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Save to Database                         │
│ {                                        │
│   resetPasswordToken: hashedToken,       │
│   resetPasswordExpire: now + 15 minutes  │
│ }                                        │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Build Reset Link                     │
│ link = frontend_url +                │
│        /reset-password/ +            │
│        token (raw, not hashed)       │
└────────────┬──────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Send Email with Reset Link       │
│ (Via SMTP - Gmail/Custom)        │
│ Contains: Beautiful HTML + Link  │
└────────────┬──────────────────────┘
             │
             ├─ Email Fails → Log error, don't expose to user
             │
             ▼
┌──────────────────────────────────┐
│ Return Success Response           │
│ Status: 200 OK                    │
│ Message: "If the email exists..." │
│ (Generic - doesn't reveal result) │
└──────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ User Receives Email              │
│ Contains Reset Link with Token   │
│ Link expires in 15 minutes       │
└──────────────────────────────────┘
```

---

## Reset Password Flow

```
User Clicks Reset Link & Enters New Password
        │
        ▼
┌─────────────────────────────────────────┐
│ POST /api/auth/reset-password/:token    │
│ Body: { password: "NewPass123@" }       │
└────────────┬──────────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Check Token Parameter             │
│ Ensure token is present           │
└────────────┬─────────────────────┘
             │
             ├─ Missing → Return 400 Error
             │
             ▼
┌──────────────────────────────────────┐
│ Validate Password Requirements       │
│ (Zod Schema)                         │
│ ✓ 8-20 characters                   │
│ ✓ Uppercase letter                  │
│ ✓ Lowercase letter                  │
│ ✓ Number                            │
│ ✓ Special character (@$!%*?&)       │
└────────────┬────────────────────────┘
             │
             ├─ Invalid → Return 400 Error with specifics
             │
             ▼
┌──────────────────────────────────────┐
│ Hash Incoming Token                  │
│ incomingHash = SHA256(token)        │
└────────────┬────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Query Database                               │
│ Find User where:                             │
│ • resetPasswordToken == incomingHash        │
│ • resetPasswordExpire > now                  │
└────────────┬───────────────────────────────┘
             │
             ├─ Not Found → Return 401 "Invalid/Expired Token"
             │
             ▼
┌──────────────────────────────────┐
│ Hash New Password                 │
│ hashedPassword = bcrypt(pwd, 10) │
│ Uses 10 salt rounds               │
└────────────┬──────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Update User Atomically                   │
│ {                                        │
│   password: hashedPassword,              │
│   resetPasswordToken: null,              │
│   resetPasswordExpire: null              │
│ }                                        │
└────────────┬──────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Return Success Response              │
│ Status: 200 OK                       │
│ Message: "Password reset successful" │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ User Can Now Login               │
│ With New Password                │
└──────────────────────────────────┘
```

---

## Database Schema

```
User Collection
{
  _id: ObjectId,
  firstName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "user"),
  birthPlace: String (required),
  location: String (required),
  portfolioUrl: String (optional),
  bio: String (optional),
  apikey: String (optional),
  model: String (optional),
  modelApiKey: String (optional),

  // NEW FIELDS FOR PASSWORD RESET
  resetPasswordToken: String | null (select: false),
  resetPasswordExpire: Date | null (select: false),

  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Service Layer Architecture

```
┌────────────────────────────────────────────┐
│         User Controller                    │
│ (Handles HTTP requests/responses)          │
└──────────┬──────────────────────┬──────────┘
           │                      │
           ▼                      ▼
    ┌─────────────┐      ┌──────────────┐
    │ Forgot      │      │ Reset        │
    │ Password()  │      │ Password()   │
    └──────┬──────┘      └──────┬───────┘
           │                    │
           ▼                    ▼
    ┌──────────────────────────────────┐
    │  Password Reset Service          │
    │  (Business Logic)                │
    │                                  │
    │  ├─ initiatePasswordReset()     │
    │  │   └─ Generate & hash token  │
    │  │   └─ Set expiry              │
    │  │   └─ Save to DB              │
    │  │                              │
    │  ├─ verifyResetToken()         │
    │  │   └─ Hash token             │
    │  │   └─ Match in DB            │
    │  │   └─ Check expiry           │
    │  │                              │
    │  └─ resetPassword()             │
    │      └─ Verify token           │
    │      └─ Hash password           │
    │      └─ Update DB              │
    │      └─ Clear token            │
    └──────────┬───────────────────┬──┘
               │                   │
               ▼                   ▼
        ┌──────────────┐  ┌──────────────┐
        │ Email        │  │ User Model   │
        │ Service      │  │ (MongoDB)    │
        │              │  │              │
        │ ├─ Send      │  │ ├─ Save      │
        │ │  Email     │  │ │ Token      │
        │ │            │  │ │            │
        │ ├─ SMTP      │  │ ├─ Update    │
        │ │  Config    │  │ │ Password   │
        │ │            │  │ │            │
        │ └─ HTML      │  │ └─ Clear     │
        │    Template  │  │   Token     │
        └──────────────┘  └──────────────┘
```

---

## Token Generation & Hashing

```
Token Generation & Storage Flow
================================

1. Generate:
   ┌─────────────────────────────────┐
   │ crypto.randomBytes(32)          │
   │ Returns: 32 bytes of entropy    │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ .toString('hex')                │
   │ Converts to 64 hex characters   │
   │ Example:                        │
   │ a7f3e9...c2b1d4                 │
   │ (64 characters)                 │
   └────────────┬────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Raw Token     │
        │ (Sent in link)│
        └───────┬───────┘
                │
                ├──────────────────────────────┐
                │                              │
                ▼                              ▼
         ┌──────────────┐            ┌─────────────────┐
         │ Email to     │            │ Hash with       │
         │ User         │            │ SHA256          │
         │ (Raw token)  │            │                 │
         │              │            │ Example:        │
         │ /reset-pwd/  │            │ 7d4f8a...9e2c1 │
         │ a7f3e9...    │            │ (64 chars)      │
         └──────────────┘            └────────┬────────┘
                                              │
                                              ▼
                                   ┌──────────────────────┐
                                   │ Store in Database    │
                                   │                      │
                                   │ resetPasswordToken:  │
                                   │ "7d4f8a...9e2c1"    │
                                   │                      │
                                   │ resetPasswordExpire: │
                                   │ now + 15 minutes     │
                                   └──────────────────────┘

2. Verification:
   ┌──────────────────────────┐
   │ User clicks link         │
   │ Frontend extracts token  │
   │ a7f3e9...c2b1d4         │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ POST /reset-password/:token
   │ Contains raw token       │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ Backend hashes again:    │
   │ SHA256(raw_token)        │
   │ = 7d4f8a...9e2c1        │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ Compare hashes:          │
   │ DB hash == New hash?     │
   │ ✓ Match → Valid!        │
   │ ✗ No match → Invalid    │
   └──────────────────────────┘
```

---

## Error Handling Flow

```
┌──────────────────────────────┐
│ Request Validation           │
└────────────┬─────────────────┘
             │
             ├─ Invalid input → 400 Bad Request
             │
             ▼
┌──────────────────────────────┐
│ Database Operations          │
└────────────┬─────────────────┘
             │
             ├─ User not found → Continue (don't expose)
             ├─ Token not found → 401 Unauthorized
             ├─ Token expired → 401 Unauthorized
             │
             ▼
┌──────────────────────────────┐
│ Password Operations          │
└────────────┬─────────────────┘
             │
             ├─ Hash fails → 500 Internal Server Error
             ├─ Update fails → 500 Internal Server Error
             │
             ▼
┌──────────────────────────────┐
│ Email Operations             │
└────────────┬─────────────────┘
             │
             ├─ SMTP connection fails → Log, continue
             ├─ Email send fails → Log, don't break flow
             │
             ▼
┌──────────────────────────────┐
│ Response to User             │
└────────────┬─────────────────┘
             │
             ├─ Success → 200 OK
             ├─ Validation error → 400 Bad Request
             ├─ Auth error → 401 Unauthorized
             ├─ Server error → 500 Internal Server Error
             │
             ▼
┌──────────────────────────────┐
│ User sees user-safe message  │
│ (No sensitive details)       │
└──────────────────────────────┘
```

---

## Security Layers

```
Request → [Validation] → [Authorization] → [Processing] → [Response]
           ┌─────────┐   ┌──────────────┐  ┌──────────┐   ┌────────┐
           │ Schema  │   │ JWT Token    │  │ Hashing  │   │ Safe   │
           │ Check   │   │ Verification │  │ Password │   │ Msg    │
           │         │   │              │  │ & Token  │   │        │
           │ Input   │   │ Rate Limit   │  │          │   │ No     │
           │ Sanitize│   │              │  │          │   │ Secrets│
           │         │   │ CORS Check   │  │          │   │        │
           └─────────┘   └──────────────┘  └──────────┘   └────────┘
```

---

**Diagrams Version:** 1.0  
**Last Updated:** January 11, 2025
