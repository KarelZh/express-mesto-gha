const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, updateLike, deleteLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { allowedUrl } = require('../utils/isLink');

const cardRouter = Router();

cardRouter.get('/', auth, getCards);
cardRouter.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(allowedUrl),
  }),
}), createCard);
cardRouter.delete('/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
cardRouter.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), updateLike);
cardRouter.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

module.exports = cardRouter;
