// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    //useNewUrlParser: false,
    //useUnifiedTopology: false,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
