const chai = require('chai');
const crypto = require('crypto');
const chaiHttp = require('chai-http');
const index = require('../routes/index')
const expect = chai.expect;
const app = require('../app')
const User = require('../models/user');
chai.use(chaiHttp);

