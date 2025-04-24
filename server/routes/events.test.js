const request = require('supertest');
const express = require('express');
const eventsRouter = require('../routes/events');

const app = express();
app.use('/api/events', eventsRouter);

describe('GET /api/events/report', () => {
  it('should return CSV report', async () => {
    const res = await request(app).get('/api/events/report?format=csv');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('title'); // adjust based on actual fields
  });

  it('should return PDF report', async () => {
    const res = await request(app).get('/api/events/report?format=pdf');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('should return 400 for invalid format', async () => {
    const res = await request(app).get('/api/events/report?format=docx');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid format/i);
  });
});
