const express = require('express');
const mongoose = require('mongoose');
const {
  userRoutes,
  cardRoutes,
} = require('./routes/index');

const {
  PORT = 3000,
} = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '630869fbb0fb1677388d05c4',
  };
  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);

  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
