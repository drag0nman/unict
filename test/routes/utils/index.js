const chai = require('chai');
const expect = chai.expect;
const crypto = require('crypto');

const User = require('../../../models/user');

module.exports.expectJson = function(request) {
  expect(request.header).to.has.property('content-type');
  expect(request.header['content-type']).contains('application/json');
};

module.exports.createUser = async function () {
  const psw = 'gabriele';
  const newUser = {
    name: 'gabriele',
    surname: 'zagarella',
    email: 'gabryzaga20@gmail.com',
    password: new Buffer(
        crypto.createHash('sha256').update(psw, 'utf8').digest()
    ).toString('base64')
  };
  

  return await User.create(newUser);
};