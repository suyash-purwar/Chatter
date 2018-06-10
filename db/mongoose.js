var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://suyash:chatter06@ds251845.mlab.com:51845/chatter');

module.exports = {mongoose};