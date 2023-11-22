const { default: mongoose } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неккоректный формат почты'
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({email})
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('NotFound'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('NotFound'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
