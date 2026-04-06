const { rawQuery, rawExecute } = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { status, type, severity, page = 1, limit = 20, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const allowed = ['created_at', 'severity', 'type'];
    const sortCol = allowed.includes(sort) ? sort : 'created_at';
    const sortDir = order === 'ASC' ? 'ASC' : 'DESC';

    let where = 'WHERE 1=1';
    const params = [];
    if (status)   { where += ' AND i.status = ?';   params.push(status); }
    if (type)     { where += ' AND i.type = ?';     params.push(type); }
    if (severity) { where += ' AND i.severity = ?'; params.push(severity); }

    const incidents = await rawQuery(
      `SELECT i.*, u.name AS reporter_name, c.name AS checkpoint_name
       FROM incidents i
       LEFT JOIN users u ON i.reported_by = u.id
       LEFT JOIN checkpoints c ON i.checkpoint_id = c.id
       ${where} ORDER BY i.${sortCol} ${sortDir}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await rawQuery(
      `SELECT COUNT(*) as total FROM incidents i ${where}`, params
    );

    res.json({
      success: true,
      data: incidents,
      pagination: { page: +page, limit: +limit, total: countResult.total }
    });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const [incident] = await rawQuery(
      `SELECT i.*, u.name AS reporter_name, c.name AS checkpoint_name
       FROM incidents i
       LEFT JOIN users u ON i.reported_by = u.id
       LEFT JOIN checkpoints c ON i.checkpoint_id = c.id
       WHERE i.id = ?`, [req.params.id]
    );
    if (!incident)
      return res.status(404).json({ success: false, message: 'Incident not found' });

    const history = await rawQuery(
      `SELECT h.*, u.name AS changed_by_name
       FROM incident_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.incident_id = ? ORDER BY h.created_at DESC`, [req.params.id]
    );

    res.json({ success: true, data: { ...incident, history } });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { checkpoint_id, type, severity, title, description, latitude, longitude } = req.body;
    if (!type || !severity || !title)
      return res.status(400).json({ success: false, message: 'type, severity, title are required' });

    const result = await rawExecute(
      `INSERT INTO incidents (checkpoint_id, type, severity, title, description, latitude, longitude, reported_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [checkpoint_id || null, type, severity, title, description || null,
       latitude || null, longitude || null, req.user.id]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, description, severity, type } = req.body;
    await rawExecute(
      `UPDATE incidents SET title = COALESCE(?, title), description = COALESCE(?, description),
       severity = COALESCE(?, severity), type = COALESCE(?, type) WHERE id = ?`,
      [title || null, description || null, severity || null, type || null, req.params.id]
    );
    res.json({ success: true, message: 'Incident updated' });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const [incident] = await rawQuery('SELECT * FROM incidents WHERE id = ?', [req.params.id]);
    if (!incident)
      return res.status(404).json({ success: false, message: 'Incident not found' });

    await rawExecute(
      'UPDATE incidents SET status = ?, verified_by = ? WHERE id = ?',
      [status, req.user.id, req.params.id]
    );
    await rawExecute(
      `INSERT INTO incident_history (incident_id, old_status, new_status, changed_by, note)
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, incident.status, status, req.user.id, note || null]
    );
    await rawExecute(
      `INSERT INTO moderation_log (moderator_id, action_type, target_type, target_id)
       VALUES (?, 'status_update', 'incident', ?)`,
      [req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Status updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await rawExecute('DELETE FROM incidents WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Incident deleted' });
  } catch (err) { next(err); }
};