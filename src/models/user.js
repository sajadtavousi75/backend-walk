const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email:{type: String , required: true , unique: true},
  password: { type: String, required: true},
  role: {
    type: String,
    enum: ['ADMIN' , 'USER'],
    default: 'USER',
  }
});
userSchema.plugin(timestamp);

const User = mongoose.model("User", userSchema );
module.exports = User;