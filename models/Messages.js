const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
   author: {
      type: String,
      minLength: 3,
      required: true,
   },

   message: {
      type: String,
      minLength: 1,
      required: true,
      trim: true
   }
});

const Message = mongoose.model('messages', Schema);
module.exports = {Message};