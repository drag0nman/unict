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
