const { Router } = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const {allowedUrl} = require('../utils/isLink');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFoundError');

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(allowedUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.all('*', auth, (req, res) => {
  throw new NotFound('Неправильный путь');
});

module.exports = router;
