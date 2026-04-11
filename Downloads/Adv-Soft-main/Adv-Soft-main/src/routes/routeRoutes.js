const router = require('express').Router();
const ctrl = require('../controllers/routeController');

router.get('/estimate', ctrl.estimate);

module.exports = router;