const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ngnaehayrjwlccyguvia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmFlaGF5cmp3bGNjeWd1dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE2NjksImV4cCI6MjA1NzUwNzY2OX0.XYPIwnE8vZGnXo17d5o0lOoO7Tit4omsN_UPBRdOKUM';
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user_profile')
            .select('*')
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

    const { data, error } = await supabase
        .from('user_profiles')
        .upsert([
            {
                id: 1,  // Assuming you're updating the profile of user with ID 1
                full_name: fullName,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip_code: zipCode,
                skills: skills.join(','),
                preferences: preferences,
                availability: availability.map(date => new Date(date).toISOString())
            }
        ]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Profile updated successfully!', userProfile: data });
});

module.exports = router;