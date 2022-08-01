require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const { validationCreateUser, validationLogin } = require('./middlewares/validations');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://maria.diploma.nomoredomains.xyz',
    'https://maria.diploma.nomoredomains.xyz',
  ],
  credentials: true,
};

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use(requestLogger);

app.post('/signup', validationCreateUser, createUser);

app.post('/signin', validationLogin, login);

app.use('/users', auth, userRoutes);
app.use('/movies', auth, movieRoutes);

app.use(errorLogger);

app.use(errors());

app.listen(PORT);
