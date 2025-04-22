const request = require('supertest');
const express = require('express');
const matchingRoutes = require('./matchingRoutes');

const app = express();
app.use(express.json());
app.use('/api/match', matchingRoutes);

describe('Volunteer Matching API', () => {
    test('should return matched volunteers for a valid event', async () => {
        const response = await request(app).get('/api/match/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('event');
        expect(response.body).toHaveProperty('matchedVolunteers');
        expect(response.body.matchedVolunteers.length).toBeGreaterThan(0);
    });

    test('should return 404 for an invalid event', async () => {
        const response = await request(app).get('/api/match/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Event not found');
    });
});
