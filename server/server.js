const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});