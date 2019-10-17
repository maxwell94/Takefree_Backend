const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();

const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('User not found.');

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).send('Invalid password.');

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send('Login successfull!');
});

function validate(login) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  });

  return schema.validate(login);
}

module.exports = router;
