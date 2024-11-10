const mongoose = require("mongoose");


const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover1: {
      type: [String],
      required: false,
    },
    cover2: {
      type: [String],
      required: false,
    },
    cover3: {
      type: [String],
      required: false,
    },
    shortName: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    categoryID: {
      type: String,
      require: true,
    },
    genderID: {
      type: String,
      require: true,
    },
    price:{
      type:Number,
      required:true
    },
    size:{
      type:[String],
      required:true
    }
  },
  { timestamps: true }
);

const model = mongoose.model("Product", schema);

module.exports = model;
