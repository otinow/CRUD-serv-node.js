const HttpStatus = Object.freeze({
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401, //в случае если токена нет вообще выдаём сис.ошибку;
    FORBIDDEN: 403, // Проверяем, появилась ли ошибка в переменной err, Ошибка 403 Forbidden (Токен поддельный или просрочен), ошибка будет в случае изменения токена от момента его создания до момента проверки
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
});

module.exports = HttpStatus;
