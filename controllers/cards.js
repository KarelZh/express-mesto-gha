/* eslint-disable consistent-return */
const card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await card.find({});
    return res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card.create({ name, link, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = async (req, res, next) => {
  const removeCard = () => {
    card.findByIdAndRemove(req.params.cardId)
      .then((item) => {
        res.status(200).send(item);
      })
      .catch(next);
  };
  card.findById(req.params.cardId)
    .then((item) => {
      if (!item) {
        throw new NotFound('Карточки не существует');
      }
      if (item.owner.toString() === req.user._id) {
        return removeCard();
      }
      return next(new ForbiddenError('Попытка удалить чужую карточку'));
    })
    .catch(next);
};

const updateLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return next(new NotFound('Карточки не существует'));
      }
      res.send(item);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return next(new NotFound('Карточки не существует'));
      }
      res.send(item);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  updateLike,
  deleteLike,
};
