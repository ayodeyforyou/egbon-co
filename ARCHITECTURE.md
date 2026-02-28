# Admin Authentication Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     EGBON & CO SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               BROWSER (Client-Side)                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  index.html                                     │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  - Booking form                                 │    │   │
│  │  │  - Admin login UI                               │    │   │
│  │  │  - Mobile navigation                            │    │   │
│  │  │  ✓ NO HARDCODED PASSWORDS                       │    │   │
│  │  │  ✓ adminSessionId stored (not password)         │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                          ↓                                │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  JavaScript Functions                           │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  doLogin() → POST /api/admin/login              │    │   │
│  │  │  openAdmin() → Show login dialog                │    │   │
│  │  │  closeAdmin() → POST /api/admin/logout          │    │   │
│  │  │  submitBooking() → Save locally + WhatsApp      │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                          ↓                                │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  localStorage                                   │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  egbon_bookings: [booking objects]              │    │   │
│  │  │  egbon_sessionId: "token_abc123..."             │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ⬆️ ⬇️                                  │
│              HTTP Requests (JSON over HTTPS)                     │
│                          ⬆️ ⬇️                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               SERVER (Node.js/Express)                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Authentication Routes                          │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  POST /api/admin/login                          │    │   │
│  │  │    ├─ Receives: {username, password}            │    │   │
│  │  │    ├─ Validates password (from environment)     │    │   │
│  │  │    ├─ Creates session token                     │    │   │
│  │  │    └─ Returns: {success, sessionId}             │    │   │
│  │  │                                                  │    │   │
│  │  │  POST /api/admin/verify                         │    │   │
│  │  │    ├─ Receives: {sessionId}                     │    │   │
│  │  │    ├─ Checks if session valid & not expired     │    │   │
│  │  │    └─ Returns: {success}                        │    │   │
│  │  │                                                  │    │   │
│  │  │  POST /api/admin/logout                         │    │   │
│  │  │    ├─ Receives: {sessionId}                     │    │   │
│  │  │    ├─ Deletes session token                     │    │   │
│  │  │    └─ Returns: {success}                        │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                          ↓                                │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Session Storage (In-Memory)                    │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  sessions = {                                   │    │   │
│  │  │    "token_abc123": {                            │    │   │
│  │  │      username: "admin",                         │    │   │
│  │  │      createdAt: timestamp,                      │    │   │
│  │  │      expiresAt: timestamp + 24h                 │    │   │
│  │  │    }                                            │    │   │
│  │  │  }                                              │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                          ↓                                │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Environment Variables (Secure)                 │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │  ADMIN_PASSWORD=your_secure_password            │    │   │
│  │  │  PORT=3000                                      │    │   │
│  │  │  ✓ Not in code                                  │    │   │
│  │  │  ✓ Not in git history                           │    │   │
│  │  │  ✓ Only accessible by server process            │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Login Flow Sequence Diagram

```
User                Browser              Server
 │                    │                    │
 ├─ Clicks "Admin" ──→│                    │
 │                    ├─ Show login dialog │
 │                    │                    │
 ├─ Enters password ─→│                    │
 │                    │                    │
 ├─ Clicks login ────→│ POST /api/admin/login
 │                    ├─ {username, password} ──→│
 │                    │                           │
 │                    │                    ┌─ Check password
 │                    │                    │ against ADMIN_PASSWORD
 │                    │                    │ env variable
 │                    │                    │
 │                    │←──────────────────┤ Create session token
 │                    │ {success, sessionId}
 │                    │                    │
 │  ← Login success ──│ Store sessionId    │
 │                    │ in localStorage    │
 │                    │                    │
 │ ← Access admin ────│ All requests now   │
 │    dashboard       │ include sessionId  │
 │                    │                    │
 ├─ (24 hours later)─→│ Session expired    │
 │                    │                    │
 │ ← Logout required ─│ Must login again   │
 │                    │                    │
```

---

## Security Comparison

```
BEFORE (Insecure)              AFTER (Secure)
═══════════════════            ═════════════

Page Source:                   Page Source:
──────────                     ──────────
const ADMIN_PASS =             let adminSessionId =
  "egbon2025"  ❌                null;  ✓

Anyone can see               Password never visible
password!                   in browser! ✓

Client validates             Server validates
(can be bypassed)           (cannot be bypassed) ✓

No session mgmt             24-hour sessions ✓

Can't change password       Change via .env ✓
without editing HTML

No logout                   Logout revokes access ✓

No expiration              Sessions expire in 24h ✓
```

---

## Password Change Workflow

```
Developer                    Server
    │                          │
    ├─ Wants to change ────────→ Create .env file
    │   admin password
    │                        ADMIN_PASSWORD=newpass
    ├─ Set environment var ─→│
    │   (restart server)      │
    │                        New password loaded
    │                        ✓ No code changes needed
    │                        ✓ Not in git history
    ├─← Ready!                │
    │   New password active   │
```

---

## Data Sensitivity

```
┌─────────────────────────────────┐
│     SENSITIVE DATA              │
├─────────────────────────────────┤
│                                 │
│  Admin Password                 │
│  ├─ BEFORE: In JavaScript ❌    │
│  ├─ AFTER: In environment ✅    │
│  └─ Transport: TLS/SSL only ✅  │
│                                 │
│  Session Tokens                 │
│  ├─ BEFORE: N/A                 │
│  ├─ AFTER: In localStorage ⚠️   │
│  └─ (Expires after 24h) ✓       │
│                                 │
│  Booking Data                   │
│  ├─ In localStorage             │
│  └─ Only sensitive when exposed │
│                                 │
└─────────────────────────────────┘

⚠️ = Could be improved with httpOnly cookies in production
```

---

## Next Steps for Production

```
Current (Good Enough)           Production Ready
─────────────────────           ────────────────

✓ Server-side auth              ✓ Bcrypt password hashing
✓ Session tokens                ✓ httpOnly secure cookies
✓ Environment variables         ✓ Database for sessions
✓ 24-hour expiration            ✓ Rate limiting
                                ✓ HTTPS/SSL
                                ✓ Security headers
                                ✓ Monitoring/Logging
                                ✓ CSRF protection
```
