//Данный файл это математико-логический скелет с пустыми функциями для принятия запросов по задачам
//Когда задачи прилетают в tasks.js находящийся в идейном routes
//Тот передаёт их, в зависимости от названия, сюда, где уже идёт применение функций и работа с переменными
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter });
module.exports = 
{
    async getAll(userId) { 
        return await prisma.task.findMany({ where: { userId } }); 
    },
    async create(text, userId) {
        return await prisma.task.create({ data: { text, userId } });
    },
    async delete(id, userId) {
        return await prisma.task.delete({ where: { id, userId } });
    },
    async update(id, text, userId) {
        return await prisma.task.update({ where: { id, userId }, data: { text } });
    }
};