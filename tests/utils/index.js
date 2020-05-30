const User = require('../../models/user');
const Tweet = require('../../models/tweet');

module.exports.createTweet = async () => {
  const user = await User.create({
    name: 'Manuel',
    surname: 'Caruso',
    email: 'manuel.caruso@stevejobs.academy',
    password: ' ',
  });
  return (tweet = await Tweet.create({
    _author: user._id,
    tweet: 'Example',
  }));
};
