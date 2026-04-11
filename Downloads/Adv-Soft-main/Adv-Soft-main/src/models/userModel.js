<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:          { type: DataTypes.STRING(100), allowNull: false },
  email:         { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role:          { type: DataTypes.ENUM('citizen', 'moderator', 'admin'), defaultValue: 'citizen' },
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  refresh_token: { type: DataTypes.TEXT }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
=======
const db = require('../config/db');

class User {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    }
    // هنا سنضيف كود التسجيل (Register) لاحقاً
}
>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db

module.exports = User;