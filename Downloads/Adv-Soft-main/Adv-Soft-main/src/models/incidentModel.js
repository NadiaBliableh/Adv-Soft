<<<<<<< HEAD
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
=======
const db = require('../config/db');


class Incident {
    // جلب كل الحوادث (Road Incidents)
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM incidents ORDER BY created_at DESC');
        return rows;
    }

    // في نهاية ملف incidentModel.js


    // إضافة بلاغ جديد (للمواطنين)
    static async createReport(data) {
        const { user_id, type, description, location_name } = data;
        const sql = 'INSERT INTO reports (user_id, type, description, location_name) VALUES (?, ?, ?, ?)';
        return db.execute(sql, [user_id, type, description, location_name]);
    }
}
module.exports = {
    getAll: Incident.getAll,
    createReport: Incident.createReport
};

>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db
