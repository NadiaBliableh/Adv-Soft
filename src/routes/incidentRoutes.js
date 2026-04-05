const router = require('express').Router();
const ctrl = require('../controllers/incidentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/',                authenticate, ctrl.getAll);  // ← بدون تسجيل؟ شيل authenticate
router.get('/:id',             ctrl.getById);
router.post('/',               authenticate, ctrl.create);
router.put('/:id',             authenticate, authorize('moderator', 'admin'), ctrl.update);
router.patch('/:id/status',    authenticate, authorize('moderator', 'admin'), ctrl.updateStatus);
router.delete('/:id',          authenticate, authorize('admin'), ctrl.delete);

module.exports = router;