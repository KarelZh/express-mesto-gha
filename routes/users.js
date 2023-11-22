const { Router } = require('express');
const { getUsers, getUserById, updateProfile, updateAvatar, getMe  } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const {allowedUrl} = require('../utils/isLink');
const userRouter = Router();


userRouter.get('/', auth, getUsers);
userRouter.get('/me', auth, getMe);
userRouter.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
userRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(allowedUrl).required(),
  }),
}), updateAvatar);

module.exports = userRouter;
