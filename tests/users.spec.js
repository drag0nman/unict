const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const crypto = require('crypto');
const app = require('../app');
const User = require('../models/user');

const mongoose = require('mongoose');
chai.use(chaiHttp);

describe('[INDEX] GET /users/', () => {
  it('If users not found,then array is empty', async () => {
    const result = await chai.request(app).get('/users');
    expect(result.header).to.have.property('content-type');
    expect(result.header).to.have.property('content-type').contains('application/json');
    expect(result.status).to.equal(200);
    expect(result.body).to.be.instanceof(Array);
    expect(result.body).to.have.lengthOf(0);
  });
  describe('User inside DB', () => {
    const newUser = {
      name: 'Roberto',
      surname: 'Bianchi',
      email: 'roberto.bianchi@gmail.com',
      password: 'robertotheking'
    };
    let createdUser = undefined;
    before('Create user in db', async () => {
      createdUser = await User.create(newUser);
    });
    after('Remove created user', async () => {
      await User.deleteMany();
    });

    it('Return expected user from DB ', async () => {
      const result = await chai.request(app).get('/users/');
      expect(result.header).to.have.property('content-type').contains('application/json')
      expect(result.status).to.equal(200);
      expect(result.body).to.be.instanceof(Array);
      expect(result.body).to.have.lengthOf(1);
    });
    it('Return expected user from db', async () => {
      const result = await chai.request(app).get(`/users/${createdUser.id.toString()}`);
      expect(result.header).to.have.property('content-type');
      expect(result.header['content-type']).contains('application/json');
    });
  });
});

describe('[SHOW] GET: /users/:id', () => {
  it('Return status 404 id user is missing', async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai.request(app).get(`/users/${newObjectId}`);
    expect(result.header).to.have.property('content-type');
    expect(result.header['content-type']).contains('application/json');
    expect(result.status).to.be.equal(404);
  });
});

describe('[CREATE] POST: /users/', () => {
  const newUser = {
    name: 'Giuseppe',
    surname: 'Grasso',
    email: 'peppe.grasso@gmail.com',
    password: 'giuseppeunict'
  }
  let createdUserId = undefined;
  after('delete user', async () => {
    createdUserId ? await User.findByIdAndDelete(createdUserId) : console.log('Missing user id');
  });
  it('Create a new user inside database', async () => {
    const result = await chai.request(app).post('/users/').send(newUser);
    expect(result.header).to.have.property('content-type');
    expect(result.header['content-type']).contains('application/json');
    expect(result.body).to.have.property('_id');
    createdUserId = result.body._id;
    expect(result).to.have.status(201);
    expect(createdUserId).to.not.equal(undefined);
    expect(result.body).to.have.property('name', newUser.name);
    expect(result.body).to.have.property('surname', newUser.surname);
    expect(result.body).to.have.property('email', newUser.email);
    expect(result.body).to.have.property('password', new Buffer(
      crypto.createHash('sha256').update(newUser.password, 'utf8').digest()
      ).toString('base64'));
  });
});

