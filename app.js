const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '654267bb926e4640df8ea202',
  };

  next();
});
app.use(router);
app.use(auth);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер создан');
});
