const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Такого пользователя не существует' });
    }

    return res.status(200).send(user);
  } catch (e) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserInfoById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    });
    return await res.status(200).send(user);
  } catch (e) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserAvatarById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      avatar: req.body.avatar,
    });
    return await res.status(200).send(user);
  } catch (e) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById,
};
