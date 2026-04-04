const express = require('express');
const router = express.Router();
const Incident = require('../models/incidentModel');
//console.log("✅ Incident Routes Loaded!"); // أضيفي هذا السطر

// endpoint: GET /api/v1/incidents
router.get('/', async (req, res) => {
    try {
        console.log("Checking Incident Model:", Incident); // أضيفي هذا السطر للفحص
        const incidents = await Incident.getAll();
        res.json({ status: 'success', data: incidents });
    } catch (error) {
        console.error("The Error is:", error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;