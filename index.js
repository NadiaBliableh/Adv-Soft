require('dotenv').config();
<<<<<<< HEAD
const app = require('./src/app');
const { sequelize } = require('./src/config/db');
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Wasel API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    console.error(err);
    process.exit(1);
  });
=======
const app = require('./src/app'); // بننادي الشغل من مجلد src

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
>>>>>>> ea16e36d675a0bcc87d42dc84595de64726841db
