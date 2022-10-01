const bcrypt = require('bcryptjs'); // модуль для хеширования пароля
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Error/NotFoundError');
const CastError = require('../Error/CastError');
const ConflictError = require('../Error/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // проверим существует ли такой email или пароль
      if (!user || !password) {
        return next(new CastError('Неверный email или пароль.'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

// Создаем нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      } return res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой Email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Получаем информацию о пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  }).catch(next);
};

// Обновляем данные пользователя
module.exports.updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CastError('Переданы некорректные данные'));
    } else if (err.code === 11000) {
      next(new ConflictError('Такой Email уже зарегистрирован'));
    } else {
      next(err);
    }
  }
};
