const express = require('express');

const userRoutes = express.Router();
const cardRoutes = express.Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById,
  getMyInfo,
} = require('../controllers/users');
const {
  createCard,
  getCards,
  deleteCardById,
  likeCardById,
  dislikeCardById,
} = require('../controllers/cards');

userRoutes.get('/users', express.json(), getUsers);
userRoutes.get('/users/me', express.json(), getMyInfo);
userRoutes.get(
  '/users/:userId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum(),
    }),
  }),
  getUserById,
);
userRoutes.patch(
  '/users/me',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfoById,
);
userRoutes.patch(
  '/users/me/avatar',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
    }),
  }),
  updateUserAvatarById,
);

cardRoutes.get('/cards', express.json(), getCards);
cardRoutes.post('/cards', express.json(), createCard);
cardRoutes.delete('/cards/:cardId', express.json(), deleteCardById);
cardRoutes.put('/cards/:cardId/likes', express.json(), likeCardById);
cardRoutes.delete('/cards/:cardId/likes', express.json(), dislikeCardById);

module.exports = { userRoutes, cardRoutes };
