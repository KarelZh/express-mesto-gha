const { ERROR_400, ERROR_500, ERROR_404 } = require("../constance/statusCode");
const card = require("../models/card");


const getCards = async (req, res) => {
  try {
    const cards = await card.find({});
    return res.send(cards);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(ERROR_404).send({message: "Карточки не найдены"})
    }
    return res.status(ERROR_500).send({message: 'Ошибка на стороне сервера'});
  };
};

const createCard = async (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  card.create({name, link, owner})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({message: "Переданы некорректные данные"})
      }
      res.status(ERROR_500).send({message: 'Не удалось добавить карточку'})});
};

const deleteCard = async (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(ERROR_500).send({message: 'Не удалось удалить карточку'}));
};

const updateLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .then((card) => res.send(card))
  .catch((err) => res.status(ERROR_500).send({message: 'Не удалось поставить лайк'}))};

const deleteLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => res.send(card))
  .catch((err) => res.status(ERROR_500).send({message: 'Не удалось убрать лайк'}))};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  updateLike,
  deleteLike
};