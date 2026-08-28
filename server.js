require('dotenv').config();

const express = require('express'); 
const cookieParser = require('cookie-parser'); 
const app = express(); 

app.use (express.json());
app.use (cookieParser('СЕКРЕТНОЕ_СЛОВО_ДЛЯ_ПОДПИСИ'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/auth', require('./routes/auth.routes')); 

app.use('/tasks', require('./routes/tasks.routes'));

app.listen(3000, () => console.log("Server activated in port 3000"));