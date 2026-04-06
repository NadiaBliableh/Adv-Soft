require('dotenv').config();
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
