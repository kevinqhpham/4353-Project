const request = require('supertest');
const express = require('express');
const eventsRouter = require('./admineventsRoutes');
const pool = require('../db'); // Import the pool to close the connection

const app = express();
app.use(express.json());
app.use('/events', eventsRouter);

// Reset events array before each test
let events = [];
beforeEach(() => {
    events = [];
});

describe('Event API Tests', () => {
    afterAll(async () => {
        await pool.end(); // Close the database connection pool
    });

    it('should create a new event', async () => {
        const newEvent = {
            title: "Test Event",
            description: "This is a test event",
            date: "2025-03-08",
            time: "12:00 PM",
            location: "Online"
        };

        const response = await request(app)
            .post('/events')
            .send(newEvent)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newEvent.title);
        expect(response.body.description).toBe(newEvent.description);
        expect(new Date(response.body.date).toISOString().split('T')[0]).toBe(newEvent.date);
        expect(response.body.time).toBe("12:00:00");
        expect(response.body.location).toBe(newEvent.location);
    });

    it('should fail if required fields are missing', async () => {
        const response = await request(app)
            .post('/events')
            .send({ title: "Invalid Event" }) // Missing date and time
            .expect(400);

        expect(response.body.message).toBe('Title, date, and time are required');
    });
});
