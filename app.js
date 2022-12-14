require('dotenv').config(); // Dotenv — это модуль с нулевой зависимостью, который загружает переменные среды из .envфайла в файлы process.env.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet'); // помогает защитить приложение от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const { limiter } = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { DATABASE } = require('./utils/utils');

const { PORT = 3000, MONGO_URL = DATABASE } = process.env;
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // ограничим количество запросов для одного IP
app.use(routes); // подключаем роуты
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // подключаем обработчик ошибок celebrate
app.use(errorHandler); // подключаем централизированный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Сервер запущен на ${PORT} порту`);
});
