//Делаем регистрацию и авторизацию пользователей

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

//   содержание файла schema.prisma
//   model User {
//   id       Int    @id @default(autoincrement())
//   email    String @unique // <-- благодаря этой строчке происходит проверка email-a из-за чего создать два одинаковых мейла не получится
//   password String

    async register(email, password) { //берет готовые переменные из аргументов, обращение к функции через "authService.register"
        // Читаем раунды из .env и превращаем в число!
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await prisma.user.create({
            data: { email, password: hashedPassword }
        });
    },

// 2. Логин: ищет пользователя и сверяет пароль
    async login(email, password) { // обращение к функции через "authService.login"
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null; // Если юзера нет, возвращаем пустоту

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null; // Если пароль не подошел, возвращаем пустоту

        // Если всё ок, генерируем и возвращаем чистый токен
        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
};
    