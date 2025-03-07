const express = require('express');
const router = express.Router();

// Sample in-memory data
const volunteers = [
    { id: 1, name: "Ali", skills: ["teaching", "cooking"], location: "NY", availability: ["weekends"] },
    { id: 2, name: "Sara", skills: ["first aid", "cooking"], location: "LA", availability: ["weekdays"] }
];

const events = [
    { id: 1, name: "Soup Kitchen", requiredSkills: ["cooking"], location: "NY", urgency: "high" }
];

// Function to match volunteers with events
function matchVolunteers(event) {
    return volunteers.filter(volunteer =>
        volunteer.skills.some(skill => event.requiredSkills.includes(skill)) &&
        volunteer.location === event.location
    );
}

// API Route for matching volunteers
router.get('/:eventId', (req, res) => {
    const event = events.find(e => e.id == req.params.eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    const matchedVolunteers = matchVolunteers(event);
    res.json({ event, matchedVolunteers });
});

module.exports = router;
