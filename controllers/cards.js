const { ERROR_400, ERROR_500, ERROR_404 } = require('../constance/statusCode');
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
    .then((card) => res.status(201).send(card))
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
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
  }
  card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточки не существует');
      }
      if (card.owner.toString() === req.user._id) {
        return removeCard();
      }
      return next(new ForbiddenError('Попытка удалить чужую карточку'))
    })
    .catch(next);
};

const updateLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточки не существует'));
      }
      res.send(card);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточки не существует'));
      }
      res.send(card);
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
