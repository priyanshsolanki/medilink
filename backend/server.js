require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const passport = require('./config/passport');
const session = require('express-session');
const NotificationScheduler = require('./utils/notificationScheduler');
const recordsRoutes = require('./routes/records');

const app = express();


// ----- Prometheus Metrics -----
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000]
});
register.registerMetric(httpRequestDurationMs);

app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


connectDB().then(() => {
    console.log('Connected to MongoDB');
    NotificationScheduler.start(); // Start the notification scheduler
});

// --- CORS Setup (for React frontend to access cookies/sessions) ---
app.use(cors({
    origin: process.env.CLIENT_URL,  
    credentials: true                
}));

app.use(express.json());
app.use(compression());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      }
    })
  );                    
app.disable('x-powered-by');

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
app.use('/api/availability', require('./routes/availability'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/messages', require('./controllers/messageController'));
app.use('/api', require('./routes/records'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
