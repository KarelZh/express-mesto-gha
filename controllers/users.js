const { ERROR_400, ERROR_500, ERROR_404 } = require("../constance/statusCode");
const user = require("../models/user")

const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(ERROR_404).send({message: "Пользователи не найдены"})
    }
    return res.status(ERROR_500).send({message: 'Ошибка на стороне сервера'});
  };
};

const getUserById = async (req, res) => {
  try {
    const {userId} = req.params;
    const users = await user.findById(userId);
    if (!users) {
      throw new Error('NotFound')
    }
    return res.send(users);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_404).send({message: "Пользователь не найден"})
    }
    if (error.name === 'CastError') {
      return res.status(ERROR_400).send({message: "Передан невалидный id"})
    }
    return res.status(ERROR_500).send({message: 'Пользователь не найден'});
  };
};


const createUser = async (req, res) => {
  const {name, about, avatar} = req.body;
  user.create({name, about, avatar})
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_400).send({message: "Переданы некорректные данные"})
    }
    res.status(ERROR_500).send({message: 'Не удалось добавить пользователя'})});
};

const updateProfile = async (req, res) => {
  const {name, about} = req.body;
  user.findByIdAndUpdate(req.user._id, {name, about})
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({message: "Переданы некорректные данные"})
      }
      res.status(ERROR_500).send({message: 'Не удалось обновить пользователя'})});
};

const updateAvatar = async (req, res) => {
  user.findByIdAndUpdate(req.user._id, {avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1200px-Sunflower_from_Silesia2.jpg'})
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({message: "Переданы некорректные данные"})
      }
      res.status(ERROR_500).send({message: 'Не удалось обновить пользователя'})});
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
};