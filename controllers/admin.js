const Hotel = require("../models/hotel.js"); // Require Hotel model
const Room = require("../models/room.js"); // Require Room model
const Booking = require("../models/booking.js"); // Require Booking model

//--------------- Geocoding Setup for Maps-----------------

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//--------------- Admin Middleware -------------------

// Middleware to check setup is completed or not

module.exports.isSetupCompleted = async (req, res, next) => {
  const hotel = await Hotel.find({ owner: req.user._id });
  if (req.route.path === "/admin/setup" && hotel.length == 0) {
    next();
  } else if (req.route.path === "/admin/setup" && hotel.length > 0) {
    req.flash("error", "You have already set up a hotel with this account.");
    res.redirect("/admin/dashboard");
  } else if (req.route.path != "/admin/setup" && hotel.length == 0) {
    req.flash("error", "Please setup you hotel profile before continue.");
    res.redirect("/admin/setup");
  } else {
    next();
  }
};

// Admin route

module.exports.index = (req, res) => {
  if (req.user && req.user.role == "admin") {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/admin.ejs", { hideSomeNavLink: true });
  }
};

// Hotel setup route

module.exports.renderSetupForm = (req, res) => {
  res.render("admin/setup.ejs");
};

module.exports.setupHotel = async (req, res) => {
  try {
    let newHotel = new Hotel(req.body.hotel);
    newHotel.owner = req.user._id;

    let images = req.files;
    for (let image of images) {
      newHotel.image.push(image.filename);
    }

    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.hotel.location,
        limit: 1,
      })
      .send();

    newHotel.geometry = response.body.features[0].geometry; // Storing coordinates in DB

    await newHotel.save();

    req.flash("success", "Setup successfull");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Hotel edit route

module.exports.renderHotelEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.render("admin/hotel-edit.ejs", { hotel });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.editHotelInfo = async (req, res) => {
  try {
    const { id } = req.params;
    await Hotel.findByIdAndUpdate(id, req.body.hotel);
    req.flash("succees", "Hotel information updated successfully.");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Admin dashboard

module.exports.dashboard = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id }).populate(
      "rooms"
    );
    let bookings = [];
    const tempBookings = await Booking.find({}).populate("room");
    const filteredBookings = tempBookings.filter(
      (booking) => booking.hotel._id.toString() === hotel._id.toString()
    );
    bookings = filteredBookings;
    res.render("admin/dashboard.ejs", { hotel, bookings });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// New room route

module.exports.renderNewRoomForm = (req, res) => {
  res.render("admin/new-room.ejs");
};

module.exports.createNewRoom = async (req, res) => {
  try {
    let newRoom = new Room(req.body.room);
    let hotel = await Hotel.findOne({ owner: req.user._id });
    let images = req.files;

    for (let image of images) {
      newRoom.roomImage.push(image.filename);
    }

    let savedRoom = await newRoom.save();
    hotel.rooms.push(savedRoom._id);
    await hotel.save();

    req.flash("success", "New Room created successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Edit room route

module.exports.renderRoomEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render("admin/room-edit.ejs", { room });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.editRoomInfo = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndUpdate(id, req.body.room);
    req.flash("success", "Room information updated successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Delete route

module.exports.deleteRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } });
    await Room.findByIdAndDelete(roomId);
    req.flash("success", "Room deleted successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Bookings show route

module.exports.showAllBookings = async (req, res) => {
  try {
    let bookings = [];
    const tempBookings = await Booking.find()
      .populate("hotel")
      .populate("room");
    const filteredBookings = tempBookings.filter(
      (booking) => booking.hotel.owner.toString() === req.user._id.toString()
    );
    bookings = filteredBookings;
    res.render("admin/show-bookings.ejs", { bookings });
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Booking search route

module.exports.searchByBookingId = async (req, res) => {
  try {
    let bookingId = req.query.booking_id;
    bookingId = bookingId.toUpperCase();
    const bookings = await Booking.find({ bookingId: bookingId })
      .populate("hotel")
      .populate("room");
    if (bookings.length) {
      res.render("admin/show-bookings.ejs", { bookings });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

// Booking checkout route

module.exports.markAsCheckout = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndUpdate(bookingId, { status: "done" });
    req.flash("success", "Checkout completed  successfully");
    res.redirect("/admin/bookings");
  } catch (err) {
    let { status = 500 } = err;
    console.log(err);
    req.flash("error", "Unable to checkout, Something went wrong.");
    res.status(status).redirect("/admin/bookings");
  }
};
