const mongoose = require("mongoose");
const validator = require("validator");

const song = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["rainy", "sunny", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  saves: [
    {
      type: Array,
      ref: "user",
    },
  ],
  createdAt: {
    type: "date",
    default: Date.now,
  },
});

module.exports = mongoose.model("song", song);
