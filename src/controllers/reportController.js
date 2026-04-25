const { rawQuery, rawExecute } = require('../config/db');
const UserActivity = require('../models/userActivityModel');

const checkDuplicate = async (lat, lng, category) => {
  const [dup] = await rawQuery(
    `SELECT id FROM reports
     WHERE category = ?
       AND ABS(latitude - ?) < 0.005
       AND ABS(longitude - ?) < 0.005
       AND created_at > NOW() - INTERVAL 2 HOUR
       AND status != 'rejected'
     LIMIT 1`,
    [category, lat, lng]
  );
  return dup || null;
};

exports.submit = async (req, res, next) => {
  try {
    const { latitude, longitude, category, description } = req.body;
    if (!latitude || !longitude || !category || !description)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const duplicate = await checkDuplicate(latitude, longitude, category);
    const result = await rawExecute(
      `INSERT INTO reports (user_id, latitude, longitude, category, description, status, duplicate_of)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, latitude, longitude, category, description,
       duplicate ? 'duplicate' : 'pending', duplicate?.id || null]
    );

    await UserActivity.log(req.user.id, 'report_submit', 'report', result.insertId, req.ip);

    res.status(201).json({
      success: true,
      data: { id: result.insertId, is_duplicate: !!duplicate }
    });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];
    if (status)   { where += ' AND r.status = ?';   params.push(status); }
    if (category) { where += ' AND r.category = ?'; params.push(category); }

    const reports = await rawQuery(
      `SELECT r.*, u.name AS reporter_name,
         (SELECT COUNT(*) FROM report_votes WHERE report_id = r.id AND vote = 'up')   AS upvotes,
         (SELECT COUNT(*) FROM report_votes WHERE report_id = r.id AND vote = 'down') AS downvotes
       FROM reports r
       LEFT JOIN users u ON r.user_id = u.id
       ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const [report] = await rawQuery(
      `SELECT r.*, u.name AS reporter_name FROM reports r
       LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?`, [req.params.id]
    );
    if (!report)
      return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};

exports.vote = async (req, res, next) => {
  try {
    const { vote } = req.body;
    if (!['up', 'down'].includes(vote))
      return res.status(400).json({ success: false, message: 'Vote must be up or down' });

    await rawExecute(
      `INSERT INTO report_votes (report_id, user_id, vote) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE vote = ?`,
      [req.params.id, req.user.id, vote, vote]
    );

    const [{ ups, downs }] = await rawQuery(
      `SELECT SUM(vote = 'up') as ups, SUM(vote = 'down') as downs
       FROM report_votes WHERE report_id = ?`, [req.params.id]
    );
    const score = (ups + downs) > 0 ? (ups / (ups + downs)).toFixed(2) : 0;
    await rawExecute('UPDATE reports SET confidence_score = ? WHERE id = ?', [score, req.params.id]);

    await UserActivity.log(req.user.id, 'vote', 'report', req.params.id, req.ip);

    res.json({ success: true, data: { confidence_score: score } });
  } catch (err) { next(err); }
};

exports.moderate = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    await rawExecute('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
    await rawExecute(
      `INSERT INTO moderation_log (moderator_id, action_type, target_type, target_id, reason)
       VALUES (?, 'moderation', 'report', ?, ?)`,
      [req.user.id, req.params.id, reason || null]
    );

    await UserActivity.log(req.user.id, 'moderate_report', 'report', req.params.id, req.ip);

    res.json({ success: true, message: 'Report moderated' });
  } catch (err) { next(err); }
};