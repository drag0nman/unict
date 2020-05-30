const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

const Tweet = require('../models/tweet');
const User = require('../models/user');
const createTweet = require('./utils/index');

const mongoose = require('mongoose');

chai.use(chaiHttp);

describe.only('[TWEETS] \n GET: /tweets', () => {
  describe('If there are no tweets', () => {
    it('should return lenght 0 if no tweets are found', async () => {
      const result = await chai.request(app).get('/tweets');
      expect(result.status).to.be.equal(200);
      expect(result.body).to.be.instanceOf(Array);
      expect(result.body).to.has.lengthOf(0);
    });
  });

  describe('If tweets exist', () => {
    let tweet = undefined;
    before('create tweet', async () => {
      tweet = await createTweet.createTweet();
    });
    after('delete tweet', () => {
      tweet ? tweet.remove() : console.log('cannot delete tweet');
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
