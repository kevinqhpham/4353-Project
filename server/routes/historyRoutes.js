const express = require('express');
const router = express.Router();

const volunteerHistory = [
    { name: "Houston Food Bank", description: "To provide food assistance to those in need and alleviate hunger in the community.",
      location: "535 Portwall St, Houston, TX 77029", skills: "lift heavy objects, stand", urgency: "Medium", date: "3/11/2024", status: "Participated" },

    { name: "Homeless Shelter", description: "Providing meals, shelter, and support services for individuals experiencing homelessness.",
      location: "101 Homeless Way, Houston, TX 77001", skills: "empathy, teamwork, basic problem-solving", urgency: "High", date: "4/4/2024", status: "Participated" },

    { name: "Public Library", description: "Hosting a reading event for children in the community to promote literacy and education.",
      location: "4500 Library Ln, Houston, TX 77002", skills: "communication, patience, working with children", urgency: "Low", date: "4/19/2024", status: "Canceled" },

    { name: "Blood Drive", description: "Organizing a blood donation drive to support local hospitals and medical facilities.",
      location: "500 Donation Dr, Houston, TX 77003", skills: "organization, attention to detail", urgency: "High", date: "4/30/2024", status: "No show" }
];

router.get('/history', (req, res) => {
    res.json(volunteerHistory);
});

module.exports = router;