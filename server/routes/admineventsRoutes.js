const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import PostgreSQL pool connection

// Get all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new event
router.post('/', async (req, res) => {
    const { title, description, date, time, location } = req.body;

    if (!title || !date || !time) {
        return res.status(400).json({ message: 'Title, date, and time are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO events (title, description, date, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, date, time, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an event
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location } = req.body;

    try {
        const result = await pool.query(
            'UPDATE events SET title = $1, description = $2, date = $3, time = $4, location = $5 WHERE id = $6 RETURNING *',
            [title, description, date, time, location, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
