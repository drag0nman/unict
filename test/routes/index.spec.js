const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const { expectJson, createUser } = require('./utils/index');
const User = require('../../models/user');

chai.use(chaiHttp);

describe('Get /', () => {
    const expectedResponse = {message: "I'm alive"};
    it('Test index response body', async () => {
        const result = await chai.request(app).get('/');
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 200);
        expectJson(result);
    });
});

describe('404 route index', () => {
  const expectedResponse = { message: 'Not Found', error: { status: 404 } };
  it('Test 404 route index', async () => {
    const result = await chai.request(app).get('/404');
      expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(404);
    expect(result).to.have.property('status', 404);
    expectJson(result);
  });
});

describe('Get / me', () => {
  const expectedResponse = { message: 'Missing or invalid Autentication Header', error: 'Unauthorized' };
  it('Test invalid auth route index', async () => {
    const result = await chai.request(app).get('/me');
      expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(401);
    expect(result).to.have.property('status', 401);
    expectJson(result);
  });
});

describe('Post /login', () => {
  let createdUser = undefined;
  before('create user', async () => {
    createdUser = await createUser();
  });
  after('delete user', async () => {
    createdUser ? await User.deleteMany() : console.log('missing user');
  });
  it('Test index response body 400', async () => {
    const result = await chai.request(app).post('/login');
    expect(result).to.have.property('body');
    expect(result).to.have.property('status', 400);
    expect(result.body).to.be.instanceOf(Object);
    expectJson(result);
  });
  it('Test index invalid credential', async () => {
    const expectedResponse = { message: "Invalid email or password" };
    const result = await chai.request(app).post('/login').send(createdUser);
    expect(result).to.have.property('body');
    expect(result.body).to.be.deep.equals(expectedResponse);
    expect(result).to.have.property('status', 401);
    expect(result.body).to.be.instanceOf(Object);
    expectJson(result);
  });
  it('Test index login', async () => {
    const newUser = {
      email: 'gabryzaga20@gmail.com',
      password: 'gabriele'
    }
    const result = await chai.request(app).post('/login').send(newUser);
    expect(result).to.have.property('body');
    expect(result).to.have.property('status', 200);
    expect(result.body).to.be.instanceOf(Object);
    expect(newUser).to.be.not.undefined;
    expect(newUser).to.has.property('email', newUser.email);
    expect(newUser).to.has.property('password', newUser.password);
    expectJson(result);
  });
});