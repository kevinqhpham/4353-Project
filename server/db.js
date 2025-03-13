const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',     
  password: 'password', 
  host: 'localhost',
  port: 5432,
  database: '4353'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully!');
  }
});

module.exports = pool;