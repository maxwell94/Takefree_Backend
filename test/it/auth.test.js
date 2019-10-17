const request = require('supertest');
const { User } = require('../../models/user');
const { expect } = require('chai');

let app;

describe('auth middleware', () => {
  beforeEach(() => (app = require('../../index')));
  afterEach(async () => {
    await User.deleteMany({});
    await app.close();
  });

  let token;

  const exec = () => {
    return request(app)
      .post('/api/users')
      .set('x-auth-token', token)
      .send({
        username: 'username',
        password: '12345a',
        email: 'email@localhost.com'
      });
  };

  beforeEach(() => {
    token = new User({ isAdmin: true }).generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).to.equal(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).to.equal(400);
  });

  it('should return 403 if user is not admin', async () => {
    token = new User({ isAdmin: false }).generateAuthToken();
    const res = await exec();
    expect(res.status).to.equal(403);
  });

  it('should return 200 if token is valid and user is admin', async () => {
    const res = await exec();
    expect(res.status).to.equal(200);
  });
});
