const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Report = sequelize.define('Report', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:          { type: DataTypes.INTEGER },
  latitude:         { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  longitude:        { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  category:         { type: DataTypes.ENUM('closure', 'delay', 'accident', 'checkpoint', 'weather', 'other'), allowNull: false },
  description:      { type: DataTypes.TEXT, allowNull: false },
  status:           { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'duplicate'), defaultValue: 'pending' },
  confidence_score: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0.00 },
  duplicate_of:     { type: DataTypes.INTEGER }
}, {
  tableName: 'reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Report;