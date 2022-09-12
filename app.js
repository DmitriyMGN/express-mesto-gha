const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { userRoutes, cardRoutes } = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
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
