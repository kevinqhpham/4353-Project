const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); 
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const historyRoutes = require(path.join(__dirname, 'routes', 'historyRoutes')); 
const matchingRoutes = require(path.join(__dirname, 'routes', 'matchingRoutes'));
<<<<<<< HEAD
=======

>>>>>>> 8d9cba8e18b3d88791ac5f5df5c526eb2e597996

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/match', matchingRoutes);


app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connected successfully!',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.post('/api/test-user', async (req, res) => {
  try {
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      ["testuser", "test@example.com", "password123"]
    );
    
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/match', matchingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});