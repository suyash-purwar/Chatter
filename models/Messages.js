const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Messages = new Schema({
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

module.exports = {Messages};