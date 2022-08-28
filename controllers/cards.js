const Card = require('../models/Card');

const createCard = async (req, res) => {
  try {
    const card = await new Card({ owner: req.user._id, ...req.body }).save();
    res.status(200).send(card);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
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

module.exports = {
  createCard,
  getCards,
  deleteCardById,
};
