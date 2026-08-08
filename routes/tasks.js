const express = require('express');
const router = express.Router(); //роутер это как филиал апп. апп - это одно большое помещение, оно всего одно на весь проект и поэтому использовать мы его здесь не можем т.к. оно осталось в server.js
// роутеры (функции) которые мы пишем дальше, это как его разделение на отделы, которые смогут отправиться в итоге в главный файл, мини-копия объекта app, разветвитель запросов 
const authenticateToken = require('../middlewares/auth');
const taskService = require('../services/tasks'); // Импортируем наши другие файлы

// Вместо app.get пишем router.get
router.get('/', authenticateToken, async (req, res) => {
    const tasks = await taskService.getAll(req.user.userId);
    return res.json(tasks);
});

router.post('/', authenticateToken, async (req, res) => {
    const newTask = await taskService.create(req.body.text, req.user.userId);
    return res.json(newTask);
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const text = await taskService.delete(id, req.user.userId);
        return res.send(`Задача успешно удалена!`);
    } catch (error) {
        return res.status(404).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await taskService.update(id, req.body.text, req.user.userId);
        return res.json(updated);
    } catch (error) {
        return res.status(404).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

module.exports = router; // Экспортируем роутер наружу
