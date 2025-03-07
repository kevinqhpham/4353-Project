const express = require('express');
const router = express.Router();

let events = [];

// Get all events
router.get('/', (req, res) => {
    res.json(events);
});

// Create a new event
router.post('/', (req, res) => {
    const { title, description, date, time, location } = req.body;
    if (!title || !date || !time) {
        return res.status(400).json({ message: 'Title, date, and time are required' });
    }

    const newEvent = {
        id: events.length + 1,
        title,
        description,
        date,
        time,
        location
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

// Update an event
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location } = req.body;

    const event = events.find(event => event.id == id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;

    res.json(event);
});

// Delete an event
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    events = events.filter(event => event.id != id);
    res.json({ message: 'Event deleted successfully' });
});

module.exports = router;
