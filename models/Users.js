const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
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
   }
});

module.exports = {User};