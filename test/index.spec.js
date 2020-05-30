const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('GET /', (

  it('should be born to be alive 🕺💿', async() => {

    const result = await chai.request(app).get('/');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.have.property('message');
    expect(result.body.message).to.be.equal('I\'m alive');

  })

));