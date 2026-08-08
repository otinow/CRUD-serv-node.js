// 2. Импортируем стандартный класс PrismaClient
const { PrismaClient } = require('@prisma/client');

// 3. Импортируем тот самый новый адаптер-переводчик для PostgreSQL
const { PrismaPg } = require('@prisma/adapter-pg');

const bcrypt = require('bcryptjs'); //для хэширования пароля
const jwt = require('jsonwebtoken'); //для создания токенов (аутентификации)

// 4. Создаем адаптер, передавая ему ссылку на нашу базу данных из .env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 5. Создаем клиента Призмы и передаем ему этот адаптер!
const prisma = new PrismaClient({ adapter: adapter });

module.exports = {
// 1. Регистрация: проверяет имейл и создает пользователя
    async register(email, password) { //берет готовые переменные из аргументов
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user.create({
            data: { email, password: hashedPassword }
        });
    },

    // 2. Логин: ищет пользователя и сверяет пароль
    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null; // Если юзера нет, возвращаем пустоту

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null; // Если пароль не подошел, возвращаем пустоту

        // Если всё ок, генерируем и возвращаем чистый токен
        return jwt.sign({ userId: user.id }, 'СЕКРЕТНОЕ_СЛОВО_ДЛЯ_ПОДПИСИ', { expiresIn: '1h' });
    }
};
    