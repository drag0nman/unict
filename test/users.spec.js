const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('GET /', (

  it('test users', async() => {   
    const result = await chai.request(app).get('/users');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.has.lengthOf(0);
  })
));

describe('DELETE: /users/:id', () => {
    it('delete user by id', async () => {
      const newObjectId = mongoose.Types.ObjectId();
      const result = await chai.request(app)
          .delete(`/users/${newObjectId}`);
      expect(result).to.have.property('status', 404);
      expect(result).to.have.property('body');
      expect(result.body).to.be.deep.equals(expectedNotFoundError);
    });
    describe('With an existing user', () => {
        let createdUser = undefined;
        beforeEach('create user', async () => {
          createdUser = await createUser();
        });
        afterEach('delete user', () => {
          createdUser ? createdUser.remove() : console.log('missing user');
        });
        it('Delete existing user', async () => {
          const result = await chai.request(app)
              .delete(`/users/${createdUser._id.toString()}`);
          expect(result).to.have.property('status', 200);
          expect(result).to.have.property('body');
          expect(result.body).to.be.deep.equals({message: 'User deleted'})
        });
      })

});