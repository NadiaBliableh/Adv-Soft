<<<<<<< HEAD
require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
);

const rawQuery = async (sql, params = []) => {
  const [results] = await sequelize.query(sql, {
    replacements: params,
    type: Sequelize.QueryTypes.SELECT
  });
  return results;
};

const rawExecute = async (sql, params = []) => {
  const [result] = await sequelize.query(sql, { replacements: params });
  return result;
};

module.exports = { sequelize, rawQuery, rawExecute };
=======
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
>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db
