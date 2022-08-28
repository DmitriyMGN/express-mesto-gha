const User = require('../models/user');

const SUCCESS_CODE = 200;
const DATA_CODE = 400;
const ID_CODE = 404;
const SERVER_CODE = 500;

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();

    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(SUCCESS_CODE).send(users);
  } catch (e) {
    res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ID_CODE).send({ message: 'Такого пользователя не существует' });
    }

    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserInfoById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    }, { new: true });

    if (!user) {
      return res.status(ID_CODE).send({ message: 'Пользователь с указанным id не найден.' });
    }

    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserAvatarById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      avatar: req.body.avatar,
    }, { new: true });
    if (!user) {
      return res.status(ID_CODE).send({ message: 'Пользователь с указанным id не найден.' });
    }

    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById,
};
