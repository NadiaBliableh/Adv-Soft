const db = require('../config/db');

exports.getIncidents = (req, res) => {
  db.query('SELECT * FROM incidents', (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
};

exports.addIncident = (req, res) => {
  const { type, severity, location } = req.body;

  db.query(
    'INSERT INTO incidents (type, severity, location) VALUES (?, ?, ?)',
    [type, severity, location],
    (err) => {
      if (err) return res.send(err);
      res.send('Incident added');
    }
  );
};