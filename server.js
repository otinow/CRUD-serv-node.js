// 1. Активируем чтение файла .env, чтобы Node.js видел переменную DATABASE_URL
require('dotenv').config();

const express = require('express'); //набор команд для упрощения работы с джиэс
const cookieParser = require('cookie-parser'); // 6. Создаем куки парсер для работы с файлами куки (нужно для хранения токена-авторизации в куки)
const app = express(); //сократили функцию экспресса до "апп."

app.use (express.json()); //используем ряд функций, среди которых парсинг (чтение и обработка данных)
app.use (cookieParser('СЕКРЕТНОЕ_СЛОВО_ДЛЯ_ПОДПИСИ')); // Теперь в каждом роуте у нас появится объект req.cookies, Передаем секретное слово для подписи кук 

// Разрешение CORS для работы с куками в браузере
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/auth', require('./routes/auth')); // Запросы пойдут на /auth/register, /auth/login
//require('./routes/auth') заменяется на мини_роутер_авторизации) (router);
//получается app.use('/auth', require(router))
//require(router): "приложение, применяй модуль router"
//'/auth' жесткий системный фильтр на все входящие из интернета запросы
//если приходит запрос со слов /auth то всё что идёт после /auth нужно срезать и передать в router, сам /auth при этом не передаётся, только то что идёт после него, /auth это просто "направляющая" -куда идти-

app.use('/tasks', require('./routes/tasks')); // Запросы пойдут на /tasks, /tasks/:id

app.listen(3000, () => console.log("Server activated in port 3000")); //заставляем сервер "слушать" 3000-й порт, выводим в консоль сообщение то что сервер активирован на порту 3000