const chai = require('chai');
const crypto = require('crypto');
const chaiHttp = require('chai-http');
const index = require('../routes/index')
const expect = chai.expect;
const app = require('../app')
const User = require('../models/user');
chai.use(chaiHttp);

describe('[POST] /login', () => {
    const psw = 'giuseppeunict';
    const newUser = {
        name: 'Giuseppe',
        surname: 'Grasso',
        email: 'peppe.grasso@gmail.com',
        password: new Buffer(
                crypto.createHash('sha256').update(psw, 'utf8').digest()
            ).toString('base64')
    }
    before('Create user in db', async () => {
        await User.create(newUser);
    });

    after('delete user', async () => {
        await User.deleteMany();
    });

    it('User login data not found', async () => {
        const fakeUser = {
            email: 'alessandro.ortis@gmail.com',
            password: '123456'
        }
        const result = await chai.request(app).post('/login').send(fakeUser);
        expect(result.header).to.have.property('content-type');
        expect(result.header['content-type']).contains('application/json');
        expect(result.status).to.be.equal(401);
        expect(result.body).to.have.property('message', 'Invalid email or password');
    });

    it('Login user successiful', async () => {
        const loginUser = {
            email: 'peppe.grasso@gmail.com',
            password: psw
        }
        const result = await chai.request(app).post('/login').send(loginUser);
        expect(result.header).to.have.property('content-type');
        expect(result.header['content-type']).contains('application/json');
        expect(result.status).to.be.equal(200);
    });
});

