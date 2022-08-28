const Card = require('../models/card');

const SUCCESS_CODE = 200;
const DATA_CODE = 400;
const ID_CODE = 404;
const SERVER_CODE = 500;

const createCard = async (req, res) => {
  try {
    const card = await new Card({ owner: req.user._id, ...req.body }).save();

    return res.status(SUCCESS_CODE).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(SUCCESS_CODE).send(cards);
  } catch (e) {
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(ID_CODE).send({ message: 'Карточка с указанным id не найдена.' });
    }

    return res.status(SUCCESS_CODE).send({ message: 'Карточка удалена' });
  } catch (e) {
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const likeCardById = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      return res.status(ID_CODE).send({ message: 'Карточка с указанным id не найдена.' });
    }

    return res.status(SUCCESS_CODE).send(like);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const dislikeCardById = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislike) {
      return res.status(ID_CODE).send({ message: 'Карточка с указанным id не найдена. ' });
    }

    return res.status(SUCCESS_CODE).send(dislike);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(DATA_CODE).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(SERVER_CODE).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCardById,
  dislikeCardById,
};
