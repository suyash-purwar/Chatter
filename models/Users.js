const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
   user_name: {
      type: String,
      required: true,
      minLength: 4,
      trim: true
   },

   user_password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6
   },

   isAdmin: {
      type: Boolean,
      required: true
   }
});

const Users = mongoose.model('Users', Schema);

module.exports = {Users};