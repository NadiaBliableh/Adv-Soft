const db = require('../config/db');

class User {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    }
    // هنا سنضيف كود التسجيل (Register) لاحقاً
}

module.exports = User;