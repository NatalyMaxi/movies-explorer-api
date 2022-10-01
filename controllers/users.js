const bcrypt = require('bcryptjs'); // модуль для хеширования пароля
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Error/NotFoundError');
const CastError = require('../Error/CastError');
const ConflictError = require('../Error/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST /signin - аутентификация пользователя
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CastError('Неверный email или пароль');
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    }
  } catch (err) {
    next(err);
  }
};

// POST /signup - создаем нового пользователя
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email && !password && !name) {
      throw new CastError('Введите все данные');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashPassword,
    });
    if (user) {
      res.send(user);
    }
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Такой Email уже зарегистрирован'));
    } else if (err.name === 'ValidationError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// GET /users/me - получаем информацию о пользователе
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me - обновляем данные пользователя
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
