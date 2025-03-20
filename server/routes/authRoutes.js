
const express = require('express'); 
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db'); 
const jwt = require('jsonwebtoken'); 

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
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
  try {
    const { email, password } = req.body;
    
    
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
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