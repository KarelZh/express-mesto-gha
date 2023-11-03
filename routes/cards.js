const { Router } = require("express");
const { getCards, createCard, deleteCard, updateLike, deleteLike } = require("../controllers/cards");

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', updateLike);
cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;