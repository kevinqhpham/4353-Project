const request = require('supertest');
const express = require('express');
const notificationRoutes = require('./notificationRoutes');

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

describe("Notification Routes", () => {
    it("should retrieve all notifications", async () => {
        const res = await request(app).get("/notifications/");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("message");
        expect(res.body[0]).toHaveProperty("type");
        expect(res.body[0]).toHaveProperty("timestamp");
    });

    it("should send a new valid notification", async () => {
        const newNotification = {
            message: "Volunteer event assigned.",
            type: "info",
            timestamp: "2024-02-15T10:00:00Z"
        };

        const res = await request(app).post("/notifications/").send(newNotification);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Notification sent successfully!");
        expect(res.body.newNotification).toMatchObject(newNotification);
    });

    it("should return 400 for invalid notification data", async () => {
        const invalidNotification = {
            message: "",
            type: "invalidType",
            timestamp: "not-a-date"
        };

        const res = await request(app).post("/notifications/").send(invalidNotification);
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toHaveProperty("message");
        expect(res.body.errors).toHaveProperty("type");
        expect(res.body.errors).toHaveProperty("timestamp");
    });
});
