const UserActivity = require('../models/userActivityModel');

// منع الـ spam: مثلاً مش أكثر من 5 reports في ساعة
const preventAbuse = (action, maxCount = 5, windowMinutes = 60) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return next(); // مش مسجل دخول

      const count = await UserActivity.countRecent(
        req.user.id, 
        action, 
        windowMinutes
      );

      if (count >= maxCount) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `You have exceeded the limit of ${maxCount} ${action}s per ${windowMinutes} minutes.`
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { preventAbuse };