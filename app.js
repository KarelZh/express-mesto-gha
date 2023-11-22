const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorsHandler');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());

app.use(router);
app.use(auth);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер создан');
});
