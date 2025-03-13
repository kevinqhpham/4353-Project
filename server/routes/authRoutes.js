<<<<<<< HEAD
const express = require('express');
=======
const express = require('express'); 
const bcrypt = require('bcrypt');
>>>>>>> 8d9cba8e18b3d88791ac5f5df5c526eb2e597996
const router = express.Router();
const pool = require('../db'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

<<<<<<< HEAD
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
=======
const users = [];

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        users.push({ 
            email, 
            password: hashedPassword 
        });

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
>>>>>>> 8d9cba8e18b3d88791ac5f5df5c526eb2e597996
    }
    
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );
    
    
    const token = jwt.sign(
      { id: newUser.rows[0].id }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error during registration" });
  }
});


router.post('/login', async (req, res) => {
<<<<<<< HEAD
  try {
    const { email, password } = req.body;
    
    
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
=======
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = users.find(u => u.email === email);

        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
>>>>>>> 8d9cba8e18b3d88791ac5f5df5c526eb2e597996
    }
    
    const user = result.rows[0];
    
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '1h' }
    );
    
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error during login" });
  }
});

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    const user = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [decoded.id]
    );
    
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    
    req.user = user.rows[0];
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;