require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const passport = require('./config/passport');
const session = require('express-session');

const app = express();
connectDB();

// --- CORS Setup (for React frontend to access cookies/sessions) ---
app.use(cors({
    origin: process.env.CLIENT_URL,  // e.g., "http://localhost:3000"
    credentials: true                // allow cookies/sessions cross-origin
}));

app.use(express.json());

// --- Session & Passport Setup ---
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Your Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
