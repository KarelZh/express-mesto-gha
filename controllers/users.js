const jwt = require('jsonwebtoken');
const { ERROR_400, ERROR_500, ERROR_404, ERROR_409 } = require('../constance/statusCode');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const NotFound = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const SOLT_ROUNDS = 10;

const getUsers = async (req, res, next) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    if (error.name === 'NotFound') {
      next(new NotFound('Пользователи не найдены'));
    }
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const users = await user.findById(userId);
    if (!users) {
      throw new NotFound('Пользователь не найден');
    }
    return res.send(users);
  } catch (error) {
    if (error.message === 'NotFound') {
      next(new NotFound('Пользователь не найден'));
    }
    next(error)
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  const hash = await bcrypt.hash(password, SOLT_ROUNDS)
  user.create({ name, about, avatar, email, password: hash })
    .then((user) => res.status(201).send(
      user._id, user.name, user.about, user.avatar, user.email
    ))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      if (error.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(error);
    });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id}, 'some-secret-key', {expiresIn: '7d'})
      res.status(200).send({ token })
    }).catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(error);
    });
};
//const getMe = async (req, res) => {
//  const {_id}  = req.user;
//  return user.find({_id})
//    .then((user) => {
//      if (!user) {
//        return res.status(ERROR_400).send('Запрашиваемый пользователь не найден');
//      }
//      return res.status(200).send(...user);
//    }).catch((error) => {
//        if (error.name === 'ValidationError') {
//          return res.status(ERROR_400).send({ message: 'Переданы некорректные данные' });
//        }
//        res.status(ERROR_500).send({ message: 'Не удалось найти пользователя' });
//     })
//}
const getMe = (req, res, next) => {
  const { _id } = req.user;
  user.find({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(...user);
    })
    .catch(next);
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMe
};
