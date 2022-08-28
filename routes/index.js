const express = require('express');

const userRoutes = express.Router();
const cardRoutes = express.Router();
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserInfoById,
  updateUserAvatarById,
} = require('../controllers/users');
const {
  createCard,
  getCards,
  deleteCardById,
  likeCardById,
  dislikeCardById,
} = require('../controllers/cards');

userRoutes.get('/users', express.json(), getUsers);
userRoutes.get('/users/:userId', express.json(), getUserById);
userRoutes.post('/users', express.json(), createUser);
userRoutes.patch('/users/me', express.json(), updateUserInfoById);
userRoutes.patch('/users/me/avatar', express.json(), updateUserAvatarById);

cardRoutes.get('/cards', express.json(), getCards);
cardRoutes.post('/cards', express.json(), createCard);
cardRoutes.delete('/cards/:cardId', express.json(), deleteCardById);
cardRoutes.put('/cards/:cardId/likes', express.json(), likeCardById);
cardRoutes.delete('/cards/:cardId/likes', express.json(), dislikeCardById);

router.patch('/404', express.json(), (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' }, res.body);
});

module.exports = { userRoutes, cardRoutes, router };
