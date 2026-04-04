require('dotenv').config();
const app = require('./src/app'); // بننادي الشغل من مجلد src

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});