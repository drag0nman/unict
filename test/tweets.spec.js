const chai = require("chai");
const chaiHttp = require("chai-http");
const { createTweet } = require("./utils/createTweet");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("GET: /tweets", () => {
  it("Empty Array if no tweets are found", async () => {
    const { body } = await chai.request(app).get("/tweets");
    expect(body).to.be.instanceOf(Array);
    expect(body).to.has.lengthOf(0);
  });
  describe("Tweets inside database", () => {
    let tweet = undefined;
    before(async () => {
      tweet = await createTweet();
    });
    after(() => {
      if (tweet == undefined) return;
      tweet.remove();
    });
    it("Tweets found if present in database", async () => {
      const tweets = await chai.request(app).get("/tweets");
      expect(tweets.body).to.be.instanceOf(Array);
      expect(tweets.body).to.be.lengthOf(1);
    });
  });
});

describe('[DELETE] DELETE: /tweets/:id', () => {
  it('should return 404 status if user don\'t exists', async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai.request(app)
        .delete(`/users/${newObjectId}`);
    expect(result).to.have.property('status', 404);
    expect(result).to.have.property('body');
    expect(result.body).to.be.deep.equals(expectedNotFoundError);
  });
  describe('With an existing user', () => {
    let createdTweet = undefined;
    beforeEach('create tweet', async () => {
      createdTweet = await createTweet();
    });
    afterEach('delete tweet', () => {
      createdTweet ? createdTweet.remove() : console.log('missing tweet');
    });
    it('Delete existing tweet', async () => {
      const result = await chai.request(app)
          .delete(`/tweets/${createdTweet._id.toString()}`);
      expect(result).to.have.property('status', 200);
      expect(result).to.have.property('body');
      expect(result.body).to.be.deep.equals({message: 'Tweet deleted'})
    });
  })
  
});
