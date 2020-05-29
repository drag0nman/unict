import chai from 'chai';
import chaiHttp from 'chai-http';
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);