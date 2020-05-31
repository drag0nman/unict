const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const { expectJson } = require('./utils/index');
const Tweet = require('../../../models/tweet');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('Get: /tweets/:id', () => {
    it('Test tweet response body 404', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).get(`/tweets/${newObjectId}`);
        const expectedResponse = { message: 'Tweet not found'};
        expect(result.status).to.be.equal(404);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 404);
        expectJson(result);
    });
});

describe('Put: /tweets/:id', () => {
    it('Test tweet response body 400', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).put(`/tweets/${newObjectId}`)
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 400);
        expectJson(result);
    });
    it('Test tweet response body 404', async () => {
        const expectedResponse = { message: 'Not Found', error: { status: 404 } };
        const result = await chai.request(app).put('/tweets');
        expect(result.status).to.be.equal(404);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 404);
        expect(result.body).to.be.instanceOf(Object);
        expectJson(result);
    });
});