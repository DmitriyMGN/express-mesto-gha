const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  userRoutes,
  cardRoutes,
} = require('./routes/index');
const {
  createUser,
  login,
} = require('./controllers/users');

const {
  PORT = 3000,
} = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '630869fbb0fb1677388d05c4',
  };
  next();
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(userRoutes);
app.use(cardRoutes);
app.use((req, res) => {
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
