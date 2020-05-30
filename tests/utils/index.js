const User = require('../../models/user');
const Tweet = require('../../models/tweet');

const mongoose = require('mongoose');
var user = undefined;

module.exports.createTweet = async () => {
  User.deleteMany({});
  user = await User.create({
    name: 'Manuel',
    surname: 'Caruso',
    email: 'manuel.caruso@stevejobs.academy',
    password: 'pass',
  });
  const tweet = await Tweet.create({
    _author: user._id,
    tweet: 'Example',
  });
  return tweet;
};

module.exports.deleteTweet = (tweet) => {
  tweet ? tweet.remove() : console.log('cannot delete tweet');
  user ? user.remove() : console.log('cannot delete user');
};

module.exports.deleteAll = () => {
  User.deleteMany({});
  Tweet.deleteMany({});
};
