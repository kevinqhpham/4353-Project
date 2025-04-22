const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

jest.mock('../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

const authRoutes = require('../routes/authRoutes');
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    test('should register a new user successfully', async () => {
      bcrypt.genSalt.mockResolvedValue('mockedSalt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      pool.query.mockImplementation((query) => {
        if (query.includes('SELECT')) {
          return { rows: [] };
        } else {
          return {
            rows: [{
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              created_at: new Date()
            }]
          };
        }
      });
      
      jwt.sign.mockReturnValue('test-token');
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.message).toBe('User registered successfully');
      
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
    });
    
    test('should return error if user already exists', async () => {
      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'test@example.com' }]
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists with this email');
    });
    
    test('should handle server errors during registration', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error during registration');
    });
  });

  describe('POST /login', () => {
    test('should login user successfully with correct credentials', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword'
        }]
      });
      
      bcrypt.compare.mockResolvedValue(true);
      
      jwt.sign.mockReturnValue('test-token');
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.message).toBe('Login successful');
    });
    
    test('should return error with incorrect password', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword'
        }]
      });
      
      bcrypt.compare.mockResolvedValue(false);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
    
    test('should return error if user does not exist', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
    
    test('should handle server errors during login', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error during login');
    });
  });

  describe('GET /me', () => {
    test('should return user data when authenticated', async () => {
      jwt.verify.mockReturnValue({ id: 1 });
      
      pool.query.mockResolvedValue({
        rows: [{
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }]
      });
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'testuser');
    });
    
    test('should return error when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication required');
    });
    
    test('should return error when token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication failed');
    });
    
    test('should return error when user not found after token verification', async () => {
      jwt.verify.mockReturnValue({ id: 999 });
      
      pool.query.mockResolvedValue({ rows: [] });
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication failed');
    });
  });
});