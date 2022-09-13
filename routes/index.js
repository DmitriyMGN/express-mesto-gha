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
      userId: Joi.string().alphanum().length(24),
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
      avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  updateUserAvatarById,
);

cardRoutes.get('/cards', express.json(), getCards);
cardRoutes.post(
  '/cards',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  createCard,
);
cardRoutes.delete(
  '/cards/:cardId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardById,
);

cardRoutes.put(
  '/cards/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCardById,
);
cardRoutes.delete(
  '/cards/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCardById,
);

module.exports = { userRoutes, cardRoutes };
