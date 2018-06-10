var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<admin>:<0admin>@ds251845.mlab.com:51845/chatter');

module.exports = {mongoose};