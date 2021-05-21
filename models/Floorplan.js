const mongoose = require("mongoose");

const FloorplanSchema = mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  original: {
    type: String,
    required: true,
  },
  thumb: {
    type: String,
    required: true,
  },
  large: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Floorplans", FloorplanSchema);
