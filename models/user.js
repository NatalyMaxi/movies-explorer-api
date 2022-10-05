const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../Error/AuthorizationError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // поле указывает, что почта должна быть уникальна
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Формат почты указан не верно',
    },
  },
  password: {
    type: String,
    minlength: 8,
    select: false, // чтобы по умолчанию хеш пароля пользователя не возвращалс из базы.
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

// отключаем следующую строчку с неименованной функцией
// eslint-disable-next-line
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthorizationError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
