//Работа с задачами Получение/Создание/Редактирование/Удаление
//Здесь описан поверхностный функционал, подробный в /services/tasks.services.js

const express = require('express');
const router = express.Router(); 
const authenticateToken = require('../middlewares/auth.middlewares'); 
const taskService = require('../services/tasks.services');
const HttpStatus = require('../constants/httpStatuses'); 

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
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await taskService.update(id, req.body.text, req.user.userId); 
        return res.json(updated);
    } catch (error) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Задача не найдена или доступ запрещен" });
    }
});

module.exports = router;
