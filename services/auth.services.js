//Делаем регистрацию и авторизацию пользователей

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter });

module.exports = {
    async register(email, password) { 
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await prisma.user.create({
            data: { email, password: hashedPassword }
        });
    },


    async login(email, password) { 
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null; 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;
        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
};
    