const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  email: {
    type: String,
    required: true,
    unique: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string()
      .min(2)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    isAdmin: Joi.boolean()
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
