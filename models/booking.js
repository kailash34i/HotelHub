const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },

  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
  },

  bookingId: {
    type: String,
    required: true,
  },

  transactionId: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  phNo: {
    type: Number,
    required: true,
  },

  checkInDate: {
    type: Date,
    required: true,
  },

  checkOutDate: {
    type: Date,
    required: true,
  },

  totalBill: {
    type: Number,
    required: true,
  },

  bookingDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "done"],
    default: "pending",
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
