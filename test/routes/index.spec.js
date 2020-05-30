const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);

describe('Get /', () => {
  const expectedResponse = { message: "I'm alive" };
  it('Test index response body', async () => {
    const result = await chai.request(app).get('/');
    expect(result).to.have.property('body');
    expect(result.body).to.be.deep.equals(expectedResponse);
    expect(result).to.have.property('status', 200);
  });
});

describe(‘404 route index’, () => {
  const expectedResponse = { message: ‘Not Found’, error: { status: 404 } };
  it(‘Test 404 route index’, async () => {
    const result = await chai.request(app).get(‘/404’);
      expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(404);
    expect(result).to.have.property(‘status’, 404);
    expect(result.header).to.has.property(‘content - type’);
    expect(result.header[‘content - type’]).contains(‘application / json’);
  });
});
describe(‘Get / me’, () => {
  const expectedResponse = { message: “Missing or invalid Autentication Header”, error: “Unauthorized” };
  it(‘Test invalid auth route index’, async () => {
    const result = await chai.request(app).get(‘/me’);
      expect(result.body).to.be.deep.equal(expectedResponse);
    expect(result.status).to.be.equal(401);
    expect(result).to.have.property(‘status’, 401);
    expect(result.header).to.has.property(‘content - type’);
    expect(result.header[‘content - type’]).contains(‘application / json’);
  });
  // const expectedResponse404 = {message: “User not found”, error: {status: 404}};
  // it(‘Test 404 route index’, async () => {
  //     const result = await chai.request(app).get(‘/me’);
  //     expect(result.body).to.be.deep.equal(expectedResponse404);
  //     expect(result.status).to.be.equal(404);
  //     expect(result).to.have.property(‘status’, 404);
  //     expect(result.header).to.has.property(‘content-type’);
  //     expect(result.header[‘content-type’]).contains(‘application/json’);
  // });
});