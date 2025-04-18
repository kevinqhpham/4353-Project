const request = require("supertest");
const express = require("express");
const userProfileRoutes = require("./userProfileRoutes");

const app = express();
app.use(express.json());
app.use("/userprofile", userProfileRoutes);

describe("User Profile Routes", () => {
    it("should retrieve the user profile", async () => {
        const res = await request(app).get("/userprofile");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("fullName");
        expect(res.body).toHaveProperty("city");
    });

    it("should update the user profile with valid data", async () => {
        const newProfile = {
            fullName: "John Doe",
            address1: "456 New St",
            address2: "Apt 789",
            city: "Dallas",
            state: "TX",
            zipCode: "75001",
            skills: ["Leadership", "Teamwork"],
            preferences: "Remote only",
            availability: ["2024-03-01"]
        };

        const res = await request(app).post("/userprofile/").send(newProfile);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Profile updated successfully!");
        expect(res.body.userProfile).toMatchObject(newProfile);
    });

    it("should return 400 for invalid profile data (missing required fields)", async () => {
        const invalidProfile = {
            fullName: "",
            address1: "",
            city: "",
            state: "",
            zipCode: "",
            skills: [],
            preferences: "",
            availability: [],
        };
    
        const res = await request(app).post("/userprofile/").send(invalidProfile);
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toHaveProperty("fullName");
        expect(res.body.errors).toHaveProperty("address1");
        expect(res.body.errors).toHaveProperty("skills");
        expect(res.body.errors).toHaveProperty("availability");
    });
    
});
