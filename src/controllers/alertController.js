const { rawQuery, rawExecute } = require('../config/db');

exports.subscribe = async (req, res, next) => {
  try {
    const { area_name, latitude, longitude, radius_km, category } = req.body;
    const result = await rawExecute(
      `INSERT INTO alert_subscriptions (user_id, area_name, latitude, longitude, radius_km, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, area_name || null, latitude || null, longitude || null,
       radius_km || 10, category || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { next(err); }
};

exports.getMySubscriptions = async (req, res, next) => {
  try {
    const subs = await rawQuery(
      'SELECT * FROM alert_subscriptions WHERE user_id = ? AND is_active = 1', [req.user.id]
    );
    res.json({ success: true, data: subs });
  } catch (err) { next(err); }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    await rawExecute(
      'UPDATE alert_subscriptions SET is_active = 0 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) { next(err); }
};

exports.getMyAlerts = async (req, res, next) => {
  try {
    const alerts = await rawQuery(
      `SELECT a.*, i.title AS incident_title, i.type, i.severity
       FROM alerts a
       JOIN alert_subscriptions s ON a.subscription_id = s.id
       JOIN incidents i ON a.incident_id = i.id
       WHERE s.user_id = ?
       ORDER BY a.created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ success: true, data: alerts });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await rawExecute(
      `UPDATE alerts a
       JOIN alert_subscriptions s ON a.subscription_id = s.id
       SET a.is_read = 1
       WHERE a.id = ? AND s.user_id = ?`,
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) { next(err); }
};

exports.triggerAlerts = async (incidentId) => {
  try {
    const [incident] = await rawQuery('SELECT * FROM incidents WHERE id = ?', [incidentId]);
    if (!incident) return;
    const subs = await rawQuery(
      `SELECT * FROM alert_subscriptions
       WHERE is_active = 1
         AND (category IS NULL OR category = ?)
         AND (latitude IS NULL OR (
           ABS(latitude - ?) < (radius_km / 111) AND
           ABS(longitude - ?) < (radius_km / 111)
         ))`,
      [incident.type, incident.latitude, incident.longitude]
    );
    for (const sub of subs) {
      await rawExecute(
        'INSERT IGNORE INTO alerts (subscription_id, incident_id) VALUES (?, ?)',
        [sub.id, incidentId]
      );
    }
  } catch (err) { console.error('triggerAlerts error:', err); }
};
// Alerts Module - Nadia Bliableh