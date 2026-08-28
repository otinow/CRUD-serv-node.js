// 1. Регистрируем  пользователя
// 2. Помогаем пользователю залогиниться
// для обоих этих функций используется функция authService., он находится в файле /services/auth.services.js
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.services');
const HttpStatus = require('../constants/httpStatuses'); 

router.post('/register', async (req, res) => { 
    try {
        const { email, password } = req.body;
        await authService.register(email, password); 
        return res.json({ message: "Пользователь успешно зарегистрирован!" });
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Этот email уже зарегистрирован" });
    }
});

router.post('/login', async (req, res) => { 
    const { email, password } = req.body;
    const token = await authService.login(email, password); 
    if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Неверный email или пароль" });
    }

    return res.cookie('token', token, {
        httpOnly: true, 
        maxAge: 3600000
    }).json({ message: "Успешный вход в систему!" });
});

router.post('/logout', (req, res) => {
    return res.clearCookie('token').json({ message: "Вы успешно вышли из системы!" });
});

module.exports = router;
