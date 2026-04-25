// احذف هاد السطر ← require('dotenv').config();
const mysql2 = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const rawQuery = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const rawExecute = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result;
};

module.exports = { sequelize, rawQuery, rawExecute };