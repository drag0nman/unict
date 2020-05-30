const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

const Tweet = require('../models/tweet');
const User = require('../models/user');
const utils = require('./utils/index');

const mongoose = require('mongoose');
chai.use(chaiHttp);

describe('[TWEETS] \n Returns all tweets', () => {
  it('should return lenght 0 if no tweets are found', async () => {
    const result = await chai.request(app).get('/tweets');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.have.lengthOf(0);
  });

  describe('If tweets exist', () => {
    let tweet = undefined;
    before('create tweet', async () => {
      tweet = await utils.createTweet();
    });
    after('delete tweet', () => {
      utils.deleteTweet(tweet);
    });
    it(' should return lenght 1', async () => {
      const result = await chai.request(app).get('/tweets');
      expect(result.status).to.be.equal(200);
      expect(result.body).to.be.instanceOf(Array);
      expect(result.body).to.be.lengthOf(1);
    });
  });
  // describe('Server Crash', () => {
  //   it('should return status code 500', async () => {
  //     const result = await chai.request(app).get('/tweets');
  //     expect(result.status).to.be.equal(500);
  //   });
  // });
});

describe('Returns a tweet', () => {
  it('should return status 404 if tweet is missing', async () => {
    const id = mongoose.Types.ObjectId();
    const result = await chai.request(app).get(`/tweets/${id}`);
    expect(result.status).to.be.equal(404);
  });
  describe('If tweet exists', () => {
    let tweet = undefined;
    before('create tweet', async () => {
      tweet = await utils.createTweet();
    });
    after('delete tweet', () => {
      utils.deleteTweet(tweet);
    });
    it('should return that tweet', async () => {
      const result = await chai
        .request(app)
        .get(`/tweets/${tweet._id.toString()}`);
      expect(result.status).to.be.equal(200);
      expect(result.body).to.have.property('_id', tweet._id.toString());
    });
  });
});

describe(' POST: /tweets', () => {
  let tweet = undefined;
  before('cleaning', () => {
    utils.deleteAll();
  });
  after('delete tweet', async () => {
    await Tweet.findByIdAndDelete(tweet._id);
    await User.findByIdAndDelete(tweet._author);
  });
  it('should create a tweet', async () => {
    const user = await User.create({
      name: 'Manuel',
      surname: 'Caruso',
      email: 'manuel.caruso@stevejobs.academy',
      password: 'pass',
    });

    const result = await chai.request(app).post(`/tweets`).send({
      _author: user._id,
      tweet: 'Example',
    });
    tweet = result.body;

    expect(result.status).to.be.equal(201);
  });
});
