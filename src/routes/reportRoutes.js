const router  = require('express').Router();
const ctrl    = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { preventAbuse }            = require('../middleware/abusePreventionMiddleware'); // ← أضف هاد

router.get('/',               authenticate, authorize('moderator', 'admin'), ctrl.getAll);
router.get('/:id',            authenticate, ctrl.getById);
router.post('/',              authenticate, preventAbuse('report_submit', 5, 60), ctrl.submit);  // ← عدّل هاد
router.post('/:id/vote',      authenticate, preventAbuse('vote', 10, 60), ctrl.vote);            // ← عدّل هاد
router.patch('/:id/moderate', authenticate, authorize('moderator', 'admin'), ctrl.moderate);

module.exports = router;