const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');
const { fake } = require('sinon');
const { expect } = require('chai');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: fake.returns(token)
    };
    const res = {};
    const next = fake();

    auth(req, res, next);

    expect(req.user).to.contain(user);
  });
});
