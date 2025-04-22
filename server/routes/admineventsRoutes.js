const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
