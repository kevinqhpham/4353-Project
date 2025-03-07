const express = require('express');
const router = express.Router();

let userProfile = {
    fullName: 'Tom Huynh',
    address1: '123 Main St',
    address2: '',
    city: 'Houston',
    state: 'TX',
    zipCode: '77004',
    skills: ['Communication', 'Problem-solving'],
    preferences: 'In person preferred',
    availability: ['2024-02-20', '2024-02-25']
};

const validateProfile = (data) => {
    let errors = {};
    if (!data.fullName || data.fullName.length > 50) errors.fullName = 'Full name is required (Max 50 characters)';
    if (!data.address1 || data.address1.length > 100) errors.address1 = 'Address 1 is required (Max 100 characters)';
    if (!data.city || data.city.length > 100) errors.city = 'City is required (Max 100 characters)';
    if (!data.state) errors.state = 'State is required';
    if (!data.zipCode || data.zipCode.length < 5 || data.zipCode.length > 9) errors.zipCode = 'Zip code must be 5-9 characters';
    if (data.skills.length === 0) errors.skills = 'At least one skill must be selected';
    if (data.availability.length === 0) errors.availability = 'Select at least one available date';

    return errors;
};

router.get('/', (req, res) => {
    res.json(userProfile);
});

router.post('/', (req, res) => {
    const errors = validateProfile(req.body);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    userProfile = { ...req.body };
    res.json({ message: 'Profile updated successfully!', userProfile });
});

module.exports = router;
