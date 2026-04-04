const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. تشفير الباسورد
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. الحفظ في MySQL (تأكدي إن الـ userModel جاهز)
        // سنفترض حالياً أننا نرسل الرد للتأكد من وصول البيانات
        res.status(201).json({ 
            status: 'success', 
            message: 'User created (Mock)', 
            data: { email, hashedPassword } 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;