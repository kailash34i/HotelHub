const Hotel = require("../models/hotel.js"); // Require Hotel model
const Room = require("../models/room.js"); // Require Room model
const Booking = require("../models/booking.js"); // Require Room model

// Razorpay setup

const Razorpay = require("razorpay");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

// Index route

module.exports.index = (req, res) => {
  if (req.user && req.user.role === "admin") {
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/explore");
  }
};

module.exports.explore = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }
    allHotels = allHotels.reverse();

    res.render("user/index.ejs", { allHotels, filterKey: "explore" });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Show route

module.exports.showHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner")
      .populate("rooms");
    if (hotel) {
      res.render("user/show.ejs", { hotel });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Booking route

module.exports.renderBookingPage = async (req, res) => {
  const { hotelId, roomId } = req.params;
  const hotel = await Hotel.findById(hotelId);
  const room = await Room.findById(roomId);
  res.render("user/booking.ejs", { hotel, room });
};

module.exports.bookingAndPayment = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const { name, email, phNo, date1, date2, totalPrice } = req.body;
    const amount = parseInt(totalPrice);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: req.user.email,
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      //Generate booking id
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const userName = req.user.name;
      const nameWords = userName.split(" ");
      const initials = nameWords.map((word) => word.charAt(0));
      const result = initials.join("").toUpperCase();
      const randomBookingId = `${result}/${randomNum}`;
      //This random bookingId might be same, so we have to also check if the bookingId exists already.
      // Storing booking info in DB
      const booking = new Booking({
        user: req.user._id,
        room: roomId,
        hotel: hotelId,
        bookingId: randomBookingId,
        transactionId: order.id,
        email: email,
        name: name,
        phNo: parseInt(phNo),
        checkInDate: new Date(date1),
        checkOutDate: new Date(date2),
        totalBill: parseInt(totalPrice),
        bookingDate: new Date(),
      });

      await booking.save();

      if (!err) {
        res.status(200).send({
          success: true,
          amount: options.amount, // Send the amount to frontend
          order_id: order.id, // Send the order ID to frontend
          key_id: RAZORPAY_ID_KEY,
          name: req.body.name,
          email: req.body.email,
          contact: req.body.phNo,
          description: req.body.description, // Send the description to frontend
          bookingId: booking._id,
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Delete booking details if payment failed

module.exports.deleteBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await Booking.findByIdAndDelete(bookingId);
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Bookings show route

module.exports.bookings = async (req, res) => {
  try {
    const tempBookings = await Booking.find({ user: req.user._id })
      .populate("hotel")
      .populate("room");
    const bookings = [];
    for (let booking of tempBookings) {
      if (booking.room != null) {
        bookings.push(booking);
      }
    }
    res.render("user/bookings-order.ejs", { bookings });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};
