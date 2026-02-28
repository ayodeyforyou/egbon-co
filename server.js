const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// In-memory session store (for production, use a proper database like MongoDB or Redis)
const sessions = {};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Admin credentials (store this securely - ideally in environment variables or a database)
// In production, use bcrypt to hash passwords
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'egbon2025'; // Use env variable in production

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    // Check credentials (in production, use bcrypt for password comparison)
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session token
      const sessionId = Math.random().toString(36).substring(2, 15);
      sessions[sessionId] = {
        username: username,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiry
      };

      res.json({ success: true, sessionId: sessionId });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  try {
    const { sessionId } = req.body;
    if (sessionId && sessions[sessionId]) {
      delete sessions[sessionId];
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify session endpoint
app.post('/api/admin/verify', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId || !sessions[sessionId]) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    const session = sessions[sessionId];

    // Check expiry
    if (session.expiresAt < Date.now()) {
      delete sessions[sessionId];
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Egbon & Co server running at http://localhost:${PORT}`);
  console.log(`⚠️  IMPORTANT: Change the admin password in production!`);
  console.log(`   Set the ADMIN_PASSWORD environment variable.`);
});
