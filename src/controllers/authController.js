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
};