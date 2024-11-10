const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    count:{
      type : Number,
      required : true
    },
  },
  { timestamps: true }
);

const model = mongoose.model('ProductUser', schema);

module.exports = model;