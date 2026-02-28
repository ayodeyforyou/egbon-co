# Quick Start Guide

## First Time Setup

### 1. Install Node.js Packages
```bash
npm install
```

### 2. Set Admin Password
**Windows (Command Prompt):**
```bash
set ADMIN_PASSWORD=your_new_password
npm start
```

**Windows (PowerShell):**
```bash
$env:ADMIN_PASSWORD="your_new_password"
npm start
```

**Mac/Linux:**
```bash
export ADMIN_PASSWORD="your_new_password"
npm start
```

### 3. Access the Website
Open your browser and go to: `http://localhost:3000`

### 4. Login to Admin Panel
- Click "Admin" button
- Enter password: (whatever you set above)
- Click "Access Dashboard"

---

## Key Changes from Previous Version

✅ **Before:** Password was hardcoded in HTML (`egbon2025`)
✅ **Now:** Password is secure server-side and environment-protected

✅ **Before:** Anyone could see password in browser developer tools
✅ **Now:** Password is never sent to the browser

✅ **Before:** Had to edit HTML to change password
✅ **Now:** Change password via environment variable without touching code

---

## Migration Notes

Your existing booking data will work exactly the same way:
- All bookings stored in browser localStorage (same as before)
- Admin panel functionality unchanged
- All features work identically

The ONLY difference is security - the password is now protected! 🔐
