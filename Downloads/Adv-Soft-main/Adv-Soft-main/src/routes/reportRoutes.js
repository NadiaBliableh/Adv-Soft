const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/',                authenticate, authorize('moderator', 'admin'), ctrl.getAll);
router.get('/:id',             authenticate, ctrl.getById);
router.post('/',               authenticate, ctrl.submit);
router.post('/:id/vote',       authenticate, ctrl.vote);
router.patch('/:id/moderate',  authenticate, authorize('moderator', 'admin'), ctrl.moderate);

module.exports = router;