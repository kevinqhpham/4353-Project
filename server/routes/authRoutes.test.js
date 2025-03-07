const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const authRoutes = require('./authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Reset mocks after each test
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Auth Routes', () => {
    it('should sign up a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Signup successful');
    });

    it('should not sign up a user with missing fields', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Please fill in all fields');
    });

    it('should not sign up a user with an existing email', async () => {
        await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should log in an existing user', async () => {
        await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('should not log in with invalid credentials', async () => {
        await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should handle server errors during signup', async () => {
        // Mock the hash function to throw an error
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
            throw new Error('Server error');
        });

        const res = await request(app)
            .post('/auth/signup')
            .send({ email: 'unique@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Server error during signup');
    });

    it('should handle server errors during login', async () => {
        // First create a user so we can attempt to log in
        await request(app)
            .post('/auth/signup')
            .send({ email: 'login-test@example.com', password: 'password123' });

        // Then mock compare to throw an error
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
            throw new Error('Server error');
        });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'login-test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Server error during login');
    });
});