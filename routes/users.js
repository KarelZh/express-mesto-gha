const { Router } = require('express');
const { getUsers, getUserById, updateProfile, updateAvatar, getMe  } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const {allowedUrl} = require('../utils/isLink');
const userRouter = Router();


userRouter.get('/', auth, getUsers);
userRouter.get('/me', auth, getMe);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), auth, getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), auth, updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(allowedUrl).required(),
  }),
}), auth, updateAvatar);

module.exports = userRouter;
