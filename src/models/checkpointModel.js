const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Checkpoint = sequelize.define('Checkpoint', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:           { type: DataTypes.STRING(150), allowNull: false },
  latitude:       { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  longitude:      { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  type:           { type: DataTypes.ENUM('military', 'civilian', 'temporary'), allowNull: false },
  current_status: { type: DataTypes.ENUM('open', 'closed', 'delayed', 'unknown'), defaultValue: 'unknown' },
  description:    { type: DataTypes.TEXT }
}, {
  tableName: 'checkpoints',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Checkpoint;