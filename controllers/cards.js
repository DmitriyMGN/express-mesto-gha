const Card = require('../models/Card');

const createCard = async (req, res) => {
  try {
    const card = await new Card({ owner: req.user._id, ...req.body }).save();

    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы неккоректные данные', ...e });
    }
    return res.status(500).send({ message: e.name, ...e });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndRemove(cardId);

    return res.status(200).send({ message: 'Карточка удалена' });
  } catch (e) {
    return res.status(500).send({ message: 'Такой карточки не существует' });
  }
};

const likeCardById = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send(like);
  } catch (e) {
    return res.status(500).send({ message: 'Такой карточки не существует' });
  }
};

const dislikeCardById = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send(dislike);
  } catch (e) {
    return res.status(500).send({ message: 'Такой карточки не существует' });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCardById,
  dislikeCardById,
};
