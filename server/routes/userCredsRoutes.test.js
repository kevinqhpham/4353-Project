const request = require('supertest');
const express = require('express');
const pool = require('../db');

// Mock dependencies
jest.mock('../db');

// Set up express app for testing
const app = express();
app.use(express.json());

// Import routes
const userCredsRoutes = require('../routes/userCredsRoutes');
app.use('/api/users', userCredsRoutes);

describe('User Credentials Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    test('should return all users', async () => {
      // Mock db response
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@example.com', created_at: new Date() },
        { id: 2, username: 'user2', email: 'user2@example.com', created_at: new Date() }
      ];
      
      pool.query.mockResolvedValue({ rows: mockUsers });
      
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('username', 'user1');
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
    
    test('should handle database errors', async () => {
      // Mock db error
      pool.query.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /:id', () => {
    test('should return a single user by ID', async () => {
      // Mock db response
      const mockUser = { 
        id: 1, 
        username: 'user1', 
        email: 'user1@example.com', 
        created_at: new Date() 
      };
      
      pool.query.mockResolvedValue({ rows: [mockUser] });
      
      const response = await request(app).get('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'user1');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.arrayContaining(["1"])
      );
    });
    
    test('should return 404 if user not found', async () => {
      // Mock empty response
      pool.query.mockResolvedValue({ rows: [] });
      
      const response = await request(app).get('/api/users/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
    
    test('should handle database errors when getting a single user', async () => {
      // Mock db error
      pool.query.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app).get('/api/users/1');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /', () => {
    test('should create a new user', async () => {
      // Mock db response for user creation
      const newUser = {
        id: 3,
        username: 'newuser',
        email: 'newuser@example.com',
        created_at: new Date()
      };
      
      pool.query.mockResolvedValue({ rows: [newUser] });
      
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('username', 'newuser');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        expect.arrayContaining(['newuser', 'newuser@example.com', 'password123'])
      );
    });
    
    test('should handle database errors during user creation', async () => {
      // Mock db error
      pool.query.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});