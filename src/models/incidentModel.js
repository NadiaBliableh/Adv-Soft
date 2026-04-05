const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Incident = sequelize.define('Incident', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  checkpoint_id: { type: DataTypes.INTEGER },
  type:          { type: DataTypes.ENUM('closure', 'delay', 'accident', 'weather_hazard', 'other'), allowNull: false },
  severity:      { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), allowNull: false },
  title:         { type: DataTypes.STRING(200), allowNull: false },
  description:   { type: DataTypes.TEXT },
  latitude:      { type: DataTypes.DECIMAL(10, 7) },
  longitude:     { type: DataTypes.DECIMAL(10, 7) },
  status:        { type: DataTypes.ENUM('active', 'verified', 'resolved', 'closed'), defaultValue: 'active' },
  reported_by:   { type: DataTypes.INTEGER },
  verified_by:   { type: DataTypes.INTEGER }
}, {
  tableName: 'incidents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Incident;