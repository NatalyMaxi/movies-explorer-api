const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../Error/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validations');

router.post('/signin', validationLogin, login); // проверяет проверяет переданные в теле почту и пароль и возвращает JWT
router.post('/signup', validationCreateUser, createUser); // создаёт пользователя с переданными в теле email, password и name

router.use(auth); // защищает маршруты, которым нужны авторизация

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;