<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use('/api/v1/auth',      require('./routes/authRoutes'));
app.use('/api/v1/incidents', require('./routes/incidentRoutes'));
app.use('/api/v1/reports',   require('./routes/reportRoutes'));
app.use('/api/v1/routes',    require('./routes/routeRoutes'));
app.use('/api/v1/alerts',    require('./routes/alertsRoutes'));

app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

app.use(require('./middleware/errorHandler'));
=======
const express = require('express');
const app = express();
const incidentRoutes = require('./routes/incidentRoutes');

app.use(express.json());

// 1. تعريف المسارات في المستوى العام للملف (خارج أي دالة)
app.use('/api/v1/incidents', incidentRoutes); 
app.use('/api/v1/users', require('./routes/authRoutes')); // انقلي السطر إلى هنا ✅

// 2. مسار الترحيب الأساسي
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Wasel Palestine API" });
});
>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db

module.exports = app;