const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  hotelName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],

  amenities: {
    type: [String],
    enum: [
      "Free wifi",
      "Free parking",
      "Air conditioning",
      "TV",
      "Pool",
      "Room service",
      "Breakfast",
      "Lunch",
      "Dinner",
    ],
  },

  category: {
    type: [String],
    enum: [
      "Trending",
      "Luxury",
      "Lakefront",
      "Mountain",
      "Beach",
      "Amazing views",
      "Amazing pools",
      "Cities",
      "Countryside",
    ],
  },

  image: {
    type: Array,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  ratingAvg: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
