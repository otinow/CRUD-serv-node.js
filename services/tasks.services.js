//Данный файл это математико-логический скелет с пустыми функциями для принятия запросов по задачам
//Когда задачи прилетают в tasks.js находящийся в идейтом routes
//Тот передаёт их, в зависимости от названия, сюда, где уже идёт применение функций и работа с переменными

// 2. Импортируем стандартный класс PrismaClient
const { PrismaClient } = require('@prisma/client');

// 3. Импортируем тот самый новый адаптер-переводчик для PostgreSQL
const { PrismaPg } = require('@prisma/adapter-pg');

// 4. Создаем адаптер, передавая ему ссылку на нашу базу данных из .env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 5. Создаем клиента Призмы и передаем ему этот адаптер!
const prisma = new PrismaClient({ adapter: adapter });

// Экспортируем объект с чистыми функциями работы с БД
module.exports = //сложили все функции в объект module.exports
{
    async getAll(userId) { //замена функции req.user.userId
    // старая Функция была привязана к объекту запроса (req).Теперь функция getAll(userId) — это просто инструмент.
    // Ей всё равно, откуда пришел userId: из токена, из консоли или из тестов. Она просто говорит: «Дай мне число, и я схожу в базу».
        return await prisma.task.findMany({ where: { userId } }); //сократили функцию { where: { userId: currentUserId } }. до { where: { userId } }, это означает { where: { userId: userId } }
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