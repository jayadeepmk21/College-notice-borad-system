const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noticeRoutes = require('./routes/notices');

const app = express();
const PORT = process.env.PORT || 9001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'College Notice Board API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});