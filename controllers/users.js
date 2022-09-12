const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SUCCESS_CODE = 200;
const DATA_CODE = 400;
const ID_CODE = 404;
const SERVER_CODE = 500;

const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(401).send({ message: 'Введите логин или пароль' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }).save();

    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
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
    if (e.name === 'CastError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные' });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserInfoById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    }, { new: true, runValidators: true });

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
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send({ message: 'Поля должны быть заполнены' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(ID_CODE).send({ message: 'Пользователь не найден' });
    }

    const isUserValid = await bcrypt.compare(password, user.password);
    if (isUserValid) {
      const token = jwt.sign({ _id: user._id }, 'SECRET');
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
      });
      return res.status(SUCCESS_CODE).send(user);
    }
    return res.status(401).send({ message: 'Неверный логин или пароль' });
  } catch (e) {
    return res
      .status(SERVER_CODE)
      .send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getMyInfo = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    return res.status(SUCCESS_CODE).send(user);
  } catch (e) {
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById,
  login,
  getMyInfo,
};
