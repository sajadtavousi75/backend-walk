const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    answer: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    isAnswer: {
      type: Number,
      required: true,
    },
    mainCommendID: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Comment", schema);

module.exports = model;