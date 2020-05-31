const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../../app");
const { expectJson, createTweet } = require("./utils/index");
const Tweet = require("../../models/tweet");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("Get: /tweets", () => {
  it("Test tweets response body", async () => {
    const result = await chai.request(app).get("/tweets");
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.has.lengthOf(0);
    expectJson(result);
  });
});

describe("Get: /tweets/:id", () => {
  it("Test tweet response body 404", async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai.request(app).get(`/tweets/${newObjectId}`);
    const expectedResponse = { message: "Tweet not found" };
    expect(result.status).to.be.equal(404);
    expect(result).to.have.property("body");
    expect(result.body).to.be.deep.equals(expectedResponse);
    expect(result).to.have.property("status", 404);
    expectJson(result);
  });
});

describe("Post /tweet", () => {
  it("Test tweet response body 400", async () => {
    const result = await chai.request(app).post("/tweets");
    expect(result).to.have.property("body");
    expect(result).to.have.property("status", 400);
    expect(result.body).to.be.instanceOf(Object);
    expectJson(result);
  });
  it("Save new tweet into db", async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const expectedResponse = { message: "Not Found", error: { status: 404 } };
    const result = await chai.request(app).post(`/tweets/${newObjectId}`);
    expect(result).to.have.property("body");
    expect(result).to.have.property("status", 404);
    expect(result.body).to.be.instanceOf(Object);
    expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(404);
    expectJson(result);
  });
  describe.skip("save new tweet Post /tweets", () => {
    let createdTweet = undefined;
    before("create user", async () => {
      createdTweet = await createTweet();
    });
    after("delete tweet", async () => {
      createdTweet ? await Tweet.deleteMany() : console.log("missing tweet");
    });
    it("save new tweet inside database", async () => {
      const newTweet = {
        _author: mongoose.Types.ObjectId(),
        tweet: "Welcome all!"
      };
      const result = await chai.request(app).post(`/tweets`).send(newTweet);
      expect(result).to.have.property("body");
      expect(result).to.have.property("status", 201);
      expect(result.body).to.be.instanceOf(Object);
      expect(newTweet).to.be.not.undefined;
      expect(newTweet).to.has.property("_author");
      expect(newTweet).to.has.property("tweet");
      expectJson(result);
    });
  });
});

describe("Put: /tweets/:id", () => {
  it("Test tweet response body 400", async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai.request(app).put(`/tweets/${newObjectId}`);
    expect(result).to.have.property("body");
    expect(result).to.have.property("status", 400);
    expectJson(result);
  });
  it("Test tweet response body 404", async () => {
    const expectedResponse = { message: "Not Found", error: { status: 404 } };
    const result = await chai.request(app).put("/tweets");
    expect(result.status).to.be.equal(404);
    expect(result).to.have.property("body");
    expect(result.body).to.be.deep.equals(expectedResponse);
    expect(result).to.have.property("status", 404);
    expect(result.body).to.be.instanceOf(Object);
    expectJson(result);
  });
});

describe("DELETE: /tweet/:id", () => {
  it("Test tweet response body 404", async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const expectedResponse = { message: "Not Found", error: { status: 404 } };
    const result = await chai.request(app).delete(`/tweet/${newObjectId}`);
    expect(result).to.have.property("body");
    expect(result).to.have.property("status", 404);
    expect(result.body).to.be.instanceOf(Object);
    expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(404);
    expectJson(result);
  });
  describe.skip("Deleted an existing tweet", () => {
    let createdTweet = undefined;
    beforeEach("create tweet", async () => {
      createdTweet = await createTweet();
    });
    afterEach("delete tweet", () => {
      createdTweet ? createdTweet.remove() : console.log("missing tweet");
    });
    it("Delete existing tweet", async () => {
      const result = await chai
        .request(app)
        .delete(`/tweets/${createdTweet._id.toString()}`);
      const expectedResponse = { message: "Tweet successfully deleted" };
      expect(result).to.have.property("body");
      expect(result).to.have.property("status", 200);
      expect(result.body).to.be.instanceOf(Object);
      expect(result.body).to.be.deep.equals(expectedResponse);
      expectJson(result);
    });
  });
});
