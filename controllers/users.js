/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SOLT_ROUNDS = 10;

const getUsers = async (req, res, next) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
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
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, SOLT_ROUNDS);
  user.create({
    name, about, avatar, email, password: hash,
  })
    .then((pols) => res.status(201).send({
      _id: pols._id, name: pols.name, about: pols.about, avatar: pols.avatar, email: pols.email,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
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
    .then((pols) => {
      const token = jwt.sign({ _id: pols._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    }).catch((error) => {
      if (error.name === 'UnauthorizedError') {
        return next(new UnauthorizedError('Переданы некорректные данные'));
      }
      next(error);
    });
};
const getMe = (req, res, next) => {
  const { _id } = req.user;
  user.find({ _id })
    .then((pols) => {
      if (!pols) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(...user);
    })
    .catch(next);
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((pols) => res.send(pols))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((pols) => res.send(pols))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
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
  getMe,
};
