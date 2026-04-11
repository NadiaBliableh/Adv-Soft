const router = require('express').Router();
const ctrl = require('../controllers/alertController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/subscriptions',        authenticate, ctrl.subscribe);
router.get('/subscriptions',         authenticate, ctrl.getMySubscriptions);
router.delete('/subscriptions/:id',  authenticate, ctrl.unsubscribe);
router.get('/',                      authenticate, ctrl.getMyAlerts);
router.patch('/:id/read',            authenticate, ctrl.markRead);

module.exports = router;