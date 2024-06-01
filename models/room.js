const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomType: {
    type: String,
    required: true,
  },

  guest: {
    type: Number,
    required: true,
  },

  bedroom: {
    type: Number,
    required: true,
  },

  bed: {
    type: String,
    required: true,
    enum: ["Single Bed", "Double Bed", "Queen Bed", "King Bed", "Twin Beds"],
  },

  roomImage: {
    type: Array,
  },

  price: {
    type: Number,
    required: true,
  }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
