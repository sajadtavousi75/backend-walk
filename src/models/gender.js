const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp');


const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Gender", schema);

module.exports = model;