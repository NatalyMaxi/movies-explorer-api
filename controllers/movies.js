const Movie = require('../models/movie');
const NotFoundError = require('../Error/NotFoundError');
const ForbiddenError = require('../Error/ForbiddenError');
const CastError = require('../Error/CastError');

// GET /movies - получаем все фильмы, сохраненные пользователем
// module.exports.getMovies = async (req, res, next) => {
//   try {
//     const movies = await Movie.find({});
//     if (!movies) {
//       throw new NotFoundError('Фильмов не найдено');
//     }
//     res.send(movies);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    if (!movies || movies.length === 0) {
      res.send('Фильмов не найдено');
    }
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

// POST /movies - создаем фильм на основании переданных данных
module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      owner,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    });
    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// DELETE /movies/:movieId - удаляем фильм из списка сохраненных
module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    const movieOwnerId = movie.owner.valueOf();
    if (movieOwnerId !== userId) {
      throw new ForbiddenError('Вы не можете удалить чужой фильм');
    }
    const isRemoved = await Movie.findByIdAndRemove(movieId);
    if (!isRemoved) {
      throw new NotFoundError('Фильм не найден');
    }
    res.send(isRemoved);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Передан некорректный id фильма'));
    } else {
      next(err);
    }
  }
};
