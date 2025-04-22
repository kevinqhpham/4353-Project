const express = require('express');
const router = express.Router();

let notifications = [
    { id: 1, message: "You have a new message!", type: "info", timestamp: "2024-02-10T12:00:00Z" },
    { id: 2, message: "Your profile was updated successfully.", type: "success", timestamp: "2024-02-11T14:30:00Z" },
    { id: 3, message: "Reminder: Complete your profile setup.", type: "reminder", timestamp: "2024-02-12T09:15:00Z" }
];

const validateNotification = (data) => {
    let errors = {};
    if (!data.message || data.message.length > 200) errors.message = "Message is required (Max 200 characters)";
    if (!data.type || !["info", "success", "reminder", "warning"].includes(data.type)) errors.type = "Invalid notification type";
    if (!data.timestamp || isNaN(Date.parse(data.timestamp))) errors.timestamp = "Invalid timestamp format";

    return errors;
};

router.get('/', (req, res) => {
    res.json(notifications);
});

router.post('/', (req, res) => {
    const errors = validateNotification(req.body);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const newNotification = {
        id: notifications.length + 1,
        message: req.body.message,
        type: req.body.type,
        timestamp: req.body.timestamp
    };

    notifications.push(newNotification);
    res.status(201).json({ message: "Notification sent successfully!", newNotification });
});

module.exports = router;