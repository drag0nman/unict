const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);

describe('Get /', () => {
    const expectedResponse = {message: "I'm alive"};
    it('Test index response body', async () => {
      const result = await chai.request(app).get('/');
      expect(result).to.have.property('body');
      expect(result.body).to.be.deep.equals(expectedResponse);
      expect(result).to.have.property('status', 200);
    });
});
