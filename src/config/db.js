const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', // في XAMPP غالباً فارغ
    database: 'wasel_db',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();