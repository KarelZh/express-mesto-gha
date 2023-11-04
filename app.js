const express = require('express');
const mongoose = require('mongoose')
const router = require('./routes');
const { PORT = 3000} = process.env;
const allowedCors = ['localhost:3000'];

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  const {origin} = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  req.user = {
    _id: '654267bb926e4640df8ea202'
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log('Сервер создан');
});
