//весь данный файл - это аутентификация

const jwt = require('jsonwebtoken'); 
const HttpStatus = require('../constants/httpStatuses');

function authenticateToken (req, res, next)
    {
        const token = req.cookies.token; 
                
        if (!token) return res.sendStatus(HttpStatus.UNAUTHORIZED); 

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => 
                    {
                if (err) return res.sendStatus(HttpStatus.FORBIDDEN);                 
                req.user = user; 
                next(); 
            });
    }

    module.exports = authenticateToken;
