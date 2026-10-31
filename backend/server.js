import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage
const users = [];
const items = [];

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lost & Found API is running!',
    timestamp: new Date().toISOString()
  });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, username, password, fullName, phoneNumber } = req.body;
ECHO is on.
    console.log('Register attempt:', { email, username, fullName });
ECHO is on.
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
ECHO is on.
    const newUser = {
      id: users.length + 1,
      email,
      username,
      fullName,
      phoneNumber: phoneNumber || '',
      role: 'USER',
      createdAt: new Date()
    };
ECHO is on.
    users.push({ ...newUser, password });
ECHO is on.
    const { password: _, ...userWithoutPassword } = newUser;
ECHO is on.
    console.log('User registered successfully:', userWithoutPassword);
ECHO is on.
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: 'test-jwt-token-' + newUser.id
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
ECHO is on.
    console.log('Login attempt:', { email });
ECHO is on.
    const user = users.find(u => u.email === email && u.password === password);
ECHO is on.
    if (!user) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
ECHO is on.
    const { password: _, ...userWithoutPassword } = user;
ECHO is on.
    console.log('Login successful:', userWithoutPassword);
ECHO is on.
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: 'test-jwt-token-' + user.id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ITEM ROUTES ============
app.get('/api/items', (req, res) => {
  res.json({
    success: true,
    data: items,
    pagination: { page: 1, limit: 12, total: items.length, totalPages: 1 }
  });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

// ============ ADD SAMPLE DATA ============
items.push(
  {
    id: 1,
    title: 'Lost iPhone 13',
    description: 'Black iPhone 13 with clear case',
    category: 'ELECTRONICS',
    type: 'LOST',
    location: 'University Library',
    status: 'APPROVED',
    createdAt: new Date(),
    user: { id: 1, username: 'john_doe', fullName: 'John Doe' }
  },
  {
    id: 2,
    title: 'Found Wallet',
    description: 'Brown leather wallet',
    category: 'ACCESSORIES',
    type: 'FOUND',
    location: 'Main Cafeteria',
    status: 'APPROVED',
    createdAt: new Date(),
    user: { id: 2, username: 'jane_smith', fullName: 'Jane Smith' }
  },
  {
    id: 3,
    title: 'Lost Keys',
    description: 'Set of keys with red keychain',
    category: 'KEYS',
    type: 'LOST',
    location: 'Student Center',
    status: 'PENDING',
    createdAt: new Date(),
    user: { id: 1, username: 'john_doe', fullName: 'John Doe' }
  }
);

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log(`?? Server running at: http://localhost:${PORT}`);
  console.log(`?? Health check: http://localhost:${PORT}/api/health`);
  console.log(`?? Get items: http://localhost:${PORT}/api/items`);
  console.log(`?? Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`?? Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log('='.repeat(50));
  console.log('');
});
