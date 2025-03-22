const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Mock dependencies
jest.mock('../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Set up express app for testing
const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('../routes/authRoutes');
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    test('should register a new user successfully', async () => {
      // Mock bcrypt
      bcrypt.genSalt.mockResolvedValue('mockedSalt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      // Mock db query responses
      pool.query.mockImplementation((query) => {
        if (query.includes('SELECT')) {
          return { rows: [] }; // No existing user
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
      
      // Mock jwt
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
      // Mock db query response for existing user
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
  });

  describe('POST /login', () => {
    test('should login user successfully with correct credentials', async () => {
      // Mock user in db
      pool.query.mockResolvedValue({
        rows: [{
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword'
        }]
      });
      
      // Mock password comparison
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock jwt
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
      // Mock user in db
      pool.query.mockResolvedValue({
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword'
        }]
      });
      
      // Mock password comparison fail
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
      // Mock no user found
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
  });

  describe('GET /me', () => {
    test('should return user data when authenticated', async () => {
      // Mock jwt verification
      jwt.verify.mockReturnValue({ id: 1 });
      
      // Mock user found in db
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
  });
});