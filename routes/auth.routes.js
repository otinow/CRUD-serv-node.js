// 1. Регистрируем  пользователя
// 2. Помогаем пользователю залогиниться
// для обоих этих функций используется функция authService., он находится в файле /services/auth.services.js
// роут это что-то вроде "идейного описания", а "сервисы" это логические, математические расчёты
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.services'); // Подключаем сервис
const HttpStatus = require('../constants/httpStatuses'); //Подключаем Enum констант

router.post('/register', async (req, res) => { // 1. Регистрируем  пользователя
    try {
        const { email, password } = req.body;
        await authService.register(email, password); //authService.register находится в файле /services/auth.services.js
        return res.json({ message: "Пользователь успешно зарегистрирован!" });
    } catch (error) {
        // Ошибка сработает, если email уже занят (нарушение @unique в Prisma)
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Этот email уже зарегистрирован" });
    }
});

router.post('/login', async (req, res) => { // 2. Логиним пользователя (не аутентификация, а вход)
    const { email, password } = req.body;
    const token = await authService.login(email, password); //authService.login находится в файле /services/auth.services.js

    // Если сервис вернул null, значит email или пароль неверные
    if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Неверный email или пароль" });
    }

    // Если токен есть, красиво упаковываем его в куки цепочкой через точку
    return res.cookie('token', token, {
        httpOnly: true, //Эта кука предназначена Только для HTTP-запросов (HTTP Only), её может читать только сервер, код извне на неё не работает
        maxAge: 3600000
    }).json({ message: "Успешный вход в систему!" });
});

router.post('/logout', (req, res) => {
    return res.clearCookie('token').json({ message: "Вы успешно вышли из системы!" });
});

module.exports = router;
