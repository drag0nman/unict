const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('Get: /tweets/:id', () => {
    it('Error 404 if Tweet not found', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).get(`/tweets/${newObjectId}`);
        const expectedResponse = { message: 'Tweet not found'};
        expect(result.status).to.be.equal(404);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 404);
    });
});

describe('Put: /tweets/:id', () => {
    it('Error 500 reading the tweet', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).put(`/tweets/${newObjectId}`)
        const expectedResponse = {message: 'Error reading the tweet'};
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 500);
    });
    it('Error 404 if tweet not found', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).put(`/tweets/${newObjectId}`);
        const expectedResponse = { message: 'Tweet not found'};
        expect(result.status).to.be.equal(404);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 404);
    });
    it('Error 401 if you are not the owner', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).put(`/tweets/${newObjectId}`);
        const expectedResponse = { message: 'You are not the owner of the resource'};
        expect(result.status).to.be.equal(401);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 401);
    });
});