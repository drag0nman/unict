const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const { expectJson, createUser } = require('./utils/index');
const User = require('../../models/user');
const crypto = require('crypto');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('Get: /users', () => {
    it('Test users response body', async () => {
        const result = await chai.request(app).get('/users');
        expect(result.status).to.be.equal(200);
        expect(result.body).to.be.instanceOf(Array);
        expect(result.body).to.has.lengthOf(0);
        expectJson(result);
    })
})

describe('[show] Get: /users/:id', () => {
    it('Status 404 if errate user', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const result = await chai.request(app).get(`/users/${newObjectId}`);
        const expectedResponse = { message: 'User not found'};
        expect(result.status).to.be.equal(404);
        expect(result).to.have.property('body');
        expect(result.body).to.be.deep.equals(expectedResponse);
        expect(result).to.have.property('status', 404);
        expectJson(result);
    });
});

describe('Post /users', () => {
    let createdUser = undefined;
    before('create user', async () => {
        createdUser = await createUser();
    });
    after('delete user', async () => {
        createdUser ? await User.deleteMany() : console.log('missing user');
    });
    it('Test users response body 400', async () => {
        const result = await chai.request(app).post('/users');
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 400);
        expect(result.body).to.be.instanceOf(Object);
        expectJson(result);
    });
    it('Test user email already taken', async () => {
        const expectedResponse = { "error": "Invalid email", "message": "This email is already taken" };
        const result = await chai.request(app).post('/users').send(createdUser);
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 409);
        expect(result.body).to.be.instanceOf(Object);
        expect(result.body).to.be.deep.equals(expectedResponse);
        expectJson(result);
    });
    it('invalid credential', async () => {
        const psw = 'gabriele';
        const newUser = {
            name: 'gabriele',
            surname: 'zagarella',
            email: 'gabry',
            password: new Buffer(
                crypto.createHash('sha256').update(psw, 'utf8').digest()
            ).toString('base64')
        };
        const expectedResponse = { errors: [{"location": "body", "msg": "Invalid value", "param": "email", "value": "gabry"}]};
        const result = await chai.request(app).post('/users').send(newUser);
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 400);
        expect(result.body).to.be.instanceOf(Object);
        expectJson(result);
        expect(result.body).to.be.deep.equals(expectedResponse);
    });
    it('Save new user into db', async () => {
        const psw = 'gabriele';
        const newUser = {
            name: 'gabriele',
            surname: 'zagarella',
            email: 'gabry-zaga20@hotmail.it',
            password: new Buffer(
                crypto.createHash('sha256').update(psw, 'utf8').digest()
            ).toString('base64')
        };
        const result = await chai.request(app).post('/users').send(newUser);
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 201);
        expect(result.body).to.be.instanceOf(Object);
        expect(newUser).to.be.not.undefined;
        expect(newUser).to.has.property('name', 'gabriele');
        expect(newUser).to.has.property('surname', 'zagarella');
        expect(newUser).to.has.property('email', newUser.email);
        expect(newUser).to.has.property('password', newUser.password);
        expectJson(result);
    });
});
describe('Put /users', () => {
    let createdUser = undefined;
    before('create user', async () => {
        createdUser = await createUser();
    });
    after('delete user', async () => {
        createdUser ? await User.deleteMany() : console.log('missing user');
    });
    it('Test users response body 404', async () => {
        const expectedResponse = { message: 'Not Found', error: { status: 404 } };
        const result = await chai.request(app).put('/users');
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 404);
        expect(result.body).to.be.instanceOf(Object);
        expect(result.body).to.be.deep.equal(expectedResponse);
        expect(result.status).to.be.equal(404);
        expectJson(result);
    });
    it('Test users error 500', async () => {
        const result = await chai.request(app).put(`/users/h`);
        expect(result.status).to.be.equal(500);
        expect(result).to.have.property('status', 500);
        expectJson(result);
    });
    it('Update user', async () => {
        const newUser = {
            name: 'gabry',
            surname: 'Zaga',
            email: 'gabry@gmail.com',
            password: 'zagarella'
        };
        const result = await chai.request(app).put(`/users/${createdUser._id.toString()}`).send(newUser);
        const updatedUser = await User.findById(result.body._id);
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 200);
        expect(result.body).to.be.instanceOf(Object);
        expect(newUser).to.be.not.undefined;
        expect(updatedUser).to.has.property('name', newUser.name);
        expect(updatedUser).to.has.property('surname', newUser.surname);
        expect(updatedUser).to.has.property('password', newUser.password);
        expect(updatedUser).to.has.property('email', newUser.email);
        expectJson(result);
    });
});

describe('DELETE: /users/:id', () => {
    let createdUser = undefined;
    beforeEach('create user', async () => {
        createdUser = await createUser();
    });
    afterEach('delete user', () => {
        createdUser ? createdUser.remove() : console.log('missing user');
    });
    it('Test users response body 404', async () => {
        const newObjectId = mongoose.Types.ObjectId();
        const expectedResponse = { message: 'User non found' };
        const result = await chai.request(app).delete(`/users/${newObjectId}`);
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 404);
        expect(result.body).to.be.instanceOf(Object);
        expect(result.body).to.be.deep.equal(expectedResponse);
        expect(result.status).to.be.equal(404);
        expectJson(result);
    });
    it('Delete existing user', async () => {
        const result = await chai.request(app).delete(`/users/${createdUser._id.toString()}`);
        const expectedResponse = { message: 'User successfully deleted'};
        expect(result).to.have.property('body');
        expect(result).to.have.property('status', 200);
        expect(result.body).to.be.instanceOf(Object);
        expect(result.body).to.be.deep.equals(expectedResponse);
        expectJson(result);
    });
});

