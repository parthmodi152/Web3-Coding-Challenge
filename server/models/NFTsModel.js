const mongoose = require("mongoose");
const { Schema } = mongoose;

const NFTsSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("NFTs", NFTsSchema);
