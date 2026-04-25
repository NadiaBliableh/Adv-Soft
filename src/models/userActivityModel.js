const { rawQuery, rawExecute } = require('../config/db');

const UserActivity = {
  async log(userId, action, entityType = null, entityId = null, ipAddress = null) {
    await rawExecute(
      `INSERT INTO user_activity (user_id, action, entity_type, entity_id, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, ipAddress]
    );
  },

  async countRecent(userId, action, minutes = 60) {
    const rows = await rawQuery(
      `SELECT COUNT(*) as cnt FROM user_activity
       WHERE user_id = ? AND action = ?
       AND created_at >= NOW() - INTERVAL ? MINUTE`,
      [userId, action, minutes]
    );
    return parseInt(rows[0].cnt, 10);
  },

  async getUserHistory(userId, limit = 50) {
    return await rawQuery(
      `SELECT * FROM user_activity
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, parseInt(limit, 10)]
    );
  }
};

module.exports = UserActivity;