const express = require('express');
const router = express.Router();
const authService = require('../services/auth'); // Подключаем сервис

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        await authService.register(email, password);
        return res.json({ message: "Пользователь успешно зарегистрирован!" });
    } catch (error) {
        // Ошибка сработает, если email уже занят (нарушение @unique в Prisma)
        return res.status(400).json({ error: "Этот email уже зарегистрирован" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    // Если сервис вернул null, значит email или пароль неверные
    if (!token) {
        return res.status(400).json({ error: "Неверный email или пароль" });
    }

    // Если токен есть, красиво упаковываем его в куки цепочкой через точку
    return res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000
    }).json({ message: "Успешный вход в систему!" });
});

router.post('/logout', (req, res) => {
    return res.clearCookie('token').json({ message: "Вы успешно вышли из системы!" });
});

module.exports = router;
