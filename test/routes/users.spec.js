const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const {expectJson, createUser} = require('./utils/index');

chai.use(chaiHttp);

describe('[index] Get: /users', () => {
    
    it('-password', async () => {
        const result = await chai.request(app).get ('/users');
        expect(result.status).to.be.equal(200);
        expect(result.body).to.be.instanceOf(Array);
        expect(result.body).to.has.lengthOf(0);
        expectJson(result);
    })
    // let createdUser = undefined;
    // before('create user', async () => {
    //   createdUser = await createUser();
    // });
    // after('delete user', () => {
    //   createdUser ? createdUser.remove() : console.log('missing user');
    // });
})