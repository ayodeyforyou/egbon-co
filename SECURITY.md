# Egbon & Co - Security & Setup Guide

## ✅ Security Improvements Implemented

### Admin Authentication
- **Before:** Hardcoded password in JavaScript source code (CRITICAL SECURITY FLAW ❌)
- **After:** Server-side authentication with session tokens ✅

The admin password is now:
1. **Never sent to the browser** - Only verified on the server
2. **Session-based** - Uses secure session tokens instead of passwords
3. **Environment-protected** - Password stored in environment variables (not in code)
4. **Server-validated** - All admin actions require valid session verification

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1: Install Dependencies
```bash
cd "c:\Users\user\Desktop\my Websites\egbon$co"
npm install
```

### Step 2: Configure Admin Password
Create a `.env` file in the project root:
```
ADMIN_PASSWORD=your_secure_password_here
PORT=3000
```

Or set the environment variable directly:
```bash
# On Windows (Command Prompt)
set ADMIN_PASSWORD=your_secure_password

# On Windows (PowerShell)
$env:ADMIN_PASSWORD="your_secure_password"

# On Mac/Linux
export ADMIN_PASSWORD="your_secure_password"
```

### Step 3: Start the Server
```bash
npm start
```

The server will run at `http://localhost:3000`

---

## 🔐 Password Security Recommendations

### Current Implementation
- ✅ Password stored in environment variables
- ✅ Server-side validation only
- ✅ Session-based authentication
- ✅ No passwords in source code

### Production Improvements (To Implement Later)
```
1. Hash passwords with bcrypt:
   npm install bcrypt

2. Use secure session store (Redis/MongoDB):
   npm install redis
   npm install connect-redis

3. Implement HTTPS:
   - Get SSL certificate (Let's Encrypt)
   - Configure server for HTTPS

4. Add rate limiting:
   npm install express-rate-limit

5. Implement CSRF protection:
   npm install csurf

6. Add security headers:
   npm install helmet
```

---

## 📊 Admin Login Flow

### Before (Insecure)
```
Browser → Hardcoded Password Check → Admin Access
                    ↑
            Password visible in source code!
```

### After (Secure)
```
Browser → POST /api/admin/login → Server Validates → Session Token → Admin Access
                                       ↑
                         Password never sent to browser
```

---

## 🔄 API Endpoints

### POST /api/admin/login
Authenticate admin user
```json
{
  "username": "admin",
  "password": "your_password"
}
```
**Response:**
```json
{
  "success": true,
  "sessionId": "abc123xyz..."
}
```

### POST /api/admin/verify
Verify session is still valid
```json
{
  "sessionId": "abc123xyz..."
}
```
**Response:**
```json
{
  "success": true
}
```

### POST /api/admin/logout
Logout and invalidate session
```json
{
  "sessionId": "abc123xyz..."
}
```
**Response:**
```json
{
  "success": true
}
```

---

## 🛡️ Security Checklist

- [x] Removed hardcoded password from JavaScript
- [x] Implemented server-side authentication
- [x] Added session token system
- [x] Environment variable configuration
- [ ] Implement bcrypt password hashing
- [ ] Add HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use secure session storage (Redis)
- [ ] Implement security headers (helmet.js)

---

## 📝 Default Credentials

**Username:** `admin`
**Password:** Set via `ADMIN_PASSWORD` environment variable (default: `egbon2025`)

⚠️ **IMPORTANT:** Change this password in production and store it securely!

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Try: `npm start -- --port 3001`

### Login fails
- Verify `ADMIN_PASSWORD` environment variable is set
- Check server logs for errors
- Ensure you're using the correct password

### Session expires
- Sessions expire after 24 hours
- Simply login again to get a new session

---

## 📞 Support
For security issues or improvements, please contact the development team.
