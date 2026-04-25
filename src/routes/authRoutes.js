const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const UserActivity = require('../models/userActivityModel');

router.post('/register', authLimiter, ctrl.register);
router.post('/login',    authLimiter, ctrl.login);
router.post('/refresh',  ctrl.refresh);
router.post('/logout',   authenticate, ctrl.logout);
router.get('/me',        authenticate, ctrl.me);

// عرض نشاط مستخدم معين — للأدمن فقط
router.get('/activity/:userId',
  authenticate,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const history = await UserActivity.getUserHistory(req.params.userId, 100);
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;