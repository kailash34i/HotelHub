const Hotel = require("../models/hotel.js"); // Require Hotel model

module.exports.serachFunction = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("rooms");
    const searchInput = req.query.q.toLowerCase();

    const results = hotels.filter(
      (hotel) =>
        hotel.hotelName.toLowerCase().includes(searchInput) ||
        hotel.location.toLowerCase().includes(searchInput) ||
        hotel.country.toLowerCase().includes(searchInput)
    );

    let allHotels = [];

    for (let hotel of results) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (results.length) {
      res.render("user/index.ejs", { allHotels });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};
