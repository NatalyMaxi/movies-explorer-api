# movies-explorer-api

## :one: Краткое описание:

Репозиторий приложения проекта [Movies](https://github.com/NatalyMaxi/movies-explorer-frontend), включающий бэкенд часть приложения. Приложение создано в рамках обучения на курсах [Яндекс.Практикум](https://practicum.yandex.ru/) и является дипломной работой.

## :two: Функциональные возможности проекта:

:ballot_box_with_check: Регистрация пользователя  
 :ballot_box_with_check: Авторизация пользователя  
 :ballot_box_with_check: Редактирование данных в профиле пользователя   
 :ballot_box_with_check: Добавление и сохранение фильма в приложении  
 :ballot_box_with_check: Удаление фильма  
 :ballot_box_with_check: API реализован с валидацией запросов  
 :ballot_box_with_check: Логирование запросов и ошибок  
 :ballot_box_with_check: централизованная обработка ошибок  

### :three: Стек технологий:

JavaScript  
Node.js  
Express  
MongoDB  
nodemon  
mongoose  
dotenv  
cors  
bcryptjs  
celebrate  
jsonwebtoken  
eslint  
validator  
helmet  
winston  
express-winston  
express-rate-limit  
сервер на Ubuntu в Яндекс.Облаке
SSL-сертификаты
хранение переменных окружения в .env-файле
nginx обратный прокси-сервер

### :four: Схемы и модели ресурсов API

### :bust_in_silhouette: Поля схемы `user`:
Поле | Описание | Required(:heavy_check_mark:), type
-----|---------------|------
email | Почта пользователя, уникальная для каждого пользователя. Валидируется на соответствие схеме элекстронной почты. | :heavy_check_mark: `string`
password | Хеш пароля. База данных не возвращает это поле | :heavy_check_mark: `string`
name | Имя пользователя, от 2 до 30 символов | :heavy_check_mark: `string`
### :tv: Поля схемы `movie`:
Поле | Описание | Required(:heavy_check_mark:), type
-----|---------------|------
country | Страна создания фильма | :heavy_check_mark: `string`
director | Режиссёр фильма | :heavy_check_mark: `string`
duration | Длительность фильма | :heavy_check_mark: `number`
year | Год выпуска фильма | :heavy_check_mark: `string`
description | Описание фильма | :heavy_check_mark: `string`
image | Cсылка на постер к фильму. URL-адрес | :heavy_check_mark: `string`
trailer | Cсылка на трейлер фильма. URL-адрес | :heavy_check_mark: `string`
thumbnail | Изображение постера к фильму. URL-адрес | :heavy_check_mark: `string`
owner | _id пользователя, который сохранил статью | :heavy_check_mark: `mongoose.Schema.Types.ObjectId`
movieId | id фильма, содержащееся в ответе сервиса MoviesExplorer | :heavy_check_mark: `number`
nameRU | Название фильма на русском языке | :heavy_check_mark: `string`
nameEN | Название фильма на английском языке | :heavy_check_mark: `string`

### :five: Методы и роуты
Метод | Роут | Описание
----- |------|---------
GET | `/users/me` | возвращает email и имя
PATCH | `/users/me` | обновляет информацию о пользователе с переданными в в теле запроса email и имя
POST | `/movies` | создаёт фильм с передаными  в теле запроса `country, director, duration, year, description, image, trailer, nameRU, nameEN, movieId, thumbnail`
GET | `/movies` | возвращает фильмы, сохранённые пользователем
DELETE | `/movies/_id` | удаляет сохранённый фильм по его _id
POST | `/signup` | создает пользователя с передаными  в body email, password, name
POST | `/signin` | проверяет переданные в теле запроса email и password, возвращает JWT

### :six: Инструкция по развертыванию проекта:

```
# клонирование репозитория
git clone https://github.com/NatalyMaxi/movies-explorer-api.git

# установка зависимостей
$ npm install

# Запуск локальной разработки 
$ npm run dev

```

IP 51.250.86.225 
###### [Ссылка на Backend](https://api.domainname.nataly.nomoredomains.icu)  
###### [Ссылка на репозиторий](https://github.com/NatalyMaxi/movies-explorer-api)
