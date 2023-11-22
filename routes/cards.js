const { Router } = require('express');
const {
  getCards, createCard, deleteCard, updateLike, deleteLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const {allowedUrl} = require('../utils/isLink');

const cardRouter = Router();

cardRouter.get('/', auth, getCards);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(allowedUrl),
  }),
}), auth, createCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), auth, updateLike);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), auth, deleteLike);

module.exports = cardRouter;
