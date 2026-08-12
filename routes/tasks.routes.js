//Работа с задачами Получение/Создание/Редактирование/Удаление
//Здесь описан поверхностный функционал, подробный в /services/tasks.services.js

const express = require('express');
const router = express.Router(); //роутер это как филиал апп. апп - это одно большое помещение, оно всего одно на весь проект и поэтому использовать мы его здесь не можем т.к. оно осталось в server.js
// роутеры (функции) которые мы пишем дальше, это как его разделение на отделы, которые смогут отправиться в итоге в главный файл, мини-копия объекта app, разветвитель запросов 
const authenticateToken = require('../middlewares/auth.middlewares'); //импортируем сюда файл аутентификации
const taskService = require('../services/tasks.services'); // Импортируем математико-логический скелет для работы с задачами
const HttpStatus = require('../constants/httpStatuses'); //Подключаем Enum констант

// Вместо app.get пишем router.get
router.get('/', authenticateToken, async (req, res) => {
    const tasks = await taskService.getAll(req.user.userId); //обращаемся к функции getAll, находящейся в файле /services/tasks.services.js
    return res.json(tasks);
});

router.post('/', authenticateToken, async (req, res) => {
    const newTask = await taskService.create(req.body.text, req.user.userId); //обращаемся к функции create, находящейся в файле /services/tasks.services.js
    return res.json(newTask);
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const text = await taskService.delete(id, req.user.userId); //обращаемся к функции delete, находящейся в файле /services/tasks.services.js
        return res.send(`Задача успешно удалена!`);
    } catch (error) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await taskService.update(id, req.body.text, req.user.userId); //обращаемся к функции update, находящейся в файле /services/tasks.services.js
        return res.json(updated);
    } catch (error) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

module.exports = router; // Экспортируем роутер наружу
