const { Router } = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.all('*', (req, res) => {
  res.status(404).send({ message: 'Неправильный путь' });
});

module.exports = router;
