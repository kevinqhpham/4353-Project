const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const historyRoutes = require(path.join(__dirname, 'routes', 'historyRoutes')); 
const eventsRouter = require(path.join(__dirname, 'routes', 'admineventsRoutes'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/adminevents', eventsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
