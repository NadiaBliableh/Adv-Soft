<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { rawQuery, rawExecute } = require('../config/db');

const generateTokens = (user) => ({
  accessToken: jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  ),
  refreshToken: jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const existing = await rawQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length)
      return res.status(409).json({ success: false, message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 12);
    await rawExecute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await rawQuery(
      'SELECT * FROM users WHERE email = ? AND is_active = 1', [email]
    );
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const tokens = generateTokens(user);
    await rawExecute('UPDATE users SET refresh_token = ? WHERE id = ?',
      [tokens.refreshToken, user.id]);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const [user] = await rawQuery(
      'SELECT * FROM users WHERE id = ? AND refresh_token = ?',
      [decoded.id, refreshToken]
    );
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const tokens = generateTokens(user);
    await rawExecute('UPDATE users SET refresh_token = ? WHERE id = ?',
      [tokens.refreshToken, user.id]);

    res.json({ success: true, data: tokens });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    await rawExecute('UPDATE users SET refresh_token = NULL WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const [user] = await rawQuery(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]
    );
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
=======
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashed],
    (err) => {
      if (err) return res.send(err);
      res.send('User registered');
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email=?',
    [email],
    async (err, result) => {
      if (result.length === 0) return res.send('User not found');

      const match = await bcrypt.compare(password, result[0].password);

      if (!match) return res.send('Wrong password');

      const token = jwt.sign({ id: result[0].id }, 'secretKey');

      res.json({ token });
    }
  );
>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db
};