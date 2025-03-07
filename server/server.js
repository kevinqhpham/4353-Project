const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const historyRoutes = require(path.join(__dirname, 'routes', 'historyRoutes'));
const userProfileRoutes = require(path.join(__dirname, 'routes', 'userProfileRoutes'));
const notificationRoutes = require(path.join(__dirname, 'routes', 'notificationRoutes'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
