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

