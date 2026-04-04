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

module.exports = app;