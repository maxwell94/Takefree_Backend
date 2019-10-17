const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const config = require('config');
const bcrypt = require('bcrypt');
const validateObjectId = require('../middleware/validateObjectId');

const { User, validateUser } = require('../models/user');

router.get('/', auth, async (req, res) => {
  const pageNumber = parseInt(req.query.page);
  const itemsNumber = parseInt(req.query.items);

  let users;

  if (pageNumber && itemsNumber) {
    users = await User.find()
      .skip((pageNumber - 1) * itemsNumber)
      .limit(itemsNumber)
      .select('_id name');
  } else {
    users = await User.find();
  }

  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');
  res.send(user);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['username', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ['_id', 'username', 'email', 'isAdmin']));
});

router.put('/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id).catch(err =>
    appDebugger('[Error]', err.message)
  );

  if (!user) return res.status(404).send('User id not found');

  res.send(user);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');

  return res.send(user);
});

module.exports = router;
