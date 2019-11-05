const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

const { check } = require('express-validator');
const { checkValidation } = require('../middlewares/validation');
const { JWT_SECRET, isAuth } = require('../middlewares/auth');

router.get('/', function(req, res) {
  res.json({message: "I'm alive"});
});

router.post('/login', [
  check('email').isEmail(),
  check('password').isString().isLength({ min: 5 })
],checkValidation, function(req, res) {
  const filter = {
    email: req.body.email,
    password: new Buffer(
        crypto.createHash('sha256').update(req.body.password, 'utf8').digest()
      ).toString('base64')
  };
  User.findOne(filter, (err, user) => {
    if(err) {
      return res.status(500).json({error: err});
    }
    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }
    const accessToken = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "1 hour"});
    const bodyResponse = {
      accessToken,
      expiresIn: 3600
    };
    res.json(bodyResponse);
  });
});

router.get("/me", isAuth, function(req, res) {
  User.findOne({_id: res.locals.authInfo.userId}, "-password")
  .exec(function(err, user) {
    if(err) return res.status(500).json({error:err});
    if(!user) return res.status(404).json({message: 'User not found'})
    return res.json(user);
  });
});

module.exports = router;