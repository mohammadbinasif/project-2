const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (simulates a database)
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 22 }
];
let nextId = 4;

// ========================
// VALIDATION MIDDLEWARE
// ========================
function validateUser(req, res, next) {
  const { name, email, age } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be valid (e.g., user@example.com)');
  }

  if (age === undefined || age === null) {
    errors.push('Age is required');
  } else if (typeof age !== 'number' || age < 0 || age > 150) {
    errors.push('Age must be a number between 0 and 150');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Clean the data
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.age = Math.floor(age);

  next();
}

// ========================
// API ROUTES
// ========================

// GET / - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Backend API - Project 2',
    endpoints: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get a single user by ID',
      'POST /api/users': 'Create a new user (send JSON body)',
      'PUT /api/users/:id': 'Update a user',
      'DELETE /api/users/:id': 'Delete a user'
    }
  });
});

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// GET /api/users/:id - Get single user
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User with ID ${id} not found`
    });
  }

  res.json({ success: true, data: user });
});

// POST /api/users - Create new user
app.post('/api/users', validateUser, (req, res) => {
  const { name, email, age } = req.body;

  // Check for duplicate email
  if (users.some(u => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: 'A user with this email already exists'
    });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    age
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', validateUser, (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `User with ID ${id} not found`
    });
  }

  const { name, email, age } = req.body;

  // Check for duplicate email (excluding current user)
  if (users.some(u => u.email === email && u.id !== id)) {
    return res.status(409).json({
      success: false,
      error: 'Another user with this email already exists'
    });
  }

  users[index] = { id, name, email, age };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[index]
  });
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `User with ID ${id} not found`
    });
  }

  const deleted = users.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deleted
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found. Visit / for available endpoints.'
  });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    http://localhost:3000/');
  console.log('  GET    http://localhost:3000/api/users');
  console.log('  GET    http://localhost:3000/api/users/:id');
  console.log('  POST   http://localhost:3000/api/users');
  console.log('  PUT    http://localhost:3000/api/users/:id');
  console.log('  DELETE http://localhost:3000/api/users/:id');
});
