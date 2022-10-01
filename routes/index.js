const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../Error/NotFoundError');

router.use(auth); // защищает маршруты, которым нужны авторизация

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;