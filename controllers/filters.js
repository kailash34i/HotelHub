const Hotel = require("../models/hotel.js"); // Require Hotel model

module.exports.popular = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (Hotel.ratingAvg >= 4.5) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "popular" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.luxury = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Luxury"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "luxury" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.lakefront = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Lakefront"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "lakefront" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.mountain = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Mountain"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "mountain" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.beach = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Beach"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "beach" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.amazingViews = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Amazing views"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "amazing-views" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.amazingPools = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Amazing pools"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "amazing-pools" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.cities = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Cities"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "cities" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.countryside = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: { $in: ["Countryside"] },
    }).populate("rooms");

    let allHotels = [];
    for (let hotel of hotels) {
      if (hotel.rooms.length) {
        allHotels.push(hotel);
      }
    }

    allHotels = allHotels.reverse();

    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels, filterKey: "countryside" });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (err) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};

module.exports.filterFormResult = async (req, res) => {
  const { location, country, priceRange } = req.body;
  const filters = {};

  if (location) {
    filters.location = location;
  }

  if (country) {
    filters.country = country;
  }

  try {
    // Start building the aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "rooms",
          localField: "rooms",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" }, // Unwind the roomDetails array to treat each room as a separate document
    ];

    // Apply price range filter if specified
    if (priceRange) {
      let priceRanges = Array.isArray(priceRange) ? priceRange : [priceRange];
      const priceFilters = [];

      priceRanges.forEach((range) => {
        if (range === "15000-above") {
          priceFilters.push({ "roomDetails.price": { $gte: 15000 } });
        } else {
          const [min, max] = range.split("-").map(Number);
          priceFilters.push({ "roomDetails.price": { $gte: min, $lte: max } });
        }
      });

      pipeline.push({
        $match: {
          $or: priceFilters,
        },
      });
    }

    // Re-group by hotel after filtering rooms
    pipeline.push({
      $group: {
        _id: "$_id",
        hotel: { $first: "$$ROOT" },
        roomDetails: { $push: "$roomDetails" },
      },
    });

    // Replace the root document with the hotel document
    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$hotel", { roomDetails: "$roomDetails" }],
        },
      },
    });

    // Apply additional filters (location, country)
    if (Object.keys(filters).length > 0) {
      pipeline.push({ $match: filters });
    }

    // Re-populate the 'rooms' field
    pipeline.push({
      $lookup: {
        from: "rooms",
        localField: "rooms",
        foreignField: "_id",
        as: "rooms",
      },
    });

    // Project the desired fields
    pipeline.push({
      $project: {
        _id: 1,
        hotelName: 1,
        description: 1,
        location: 1,
        country: 1,
        ratingAvg: 1,
        amenities: 1,
        category: 1,
        image: 1,
        geometry: 1,
        rooms: 1,
        reviews: 1,
        owner: 1,
        roomDetails: 1,
      },
    });

    // Execute the aggregation pipeline
    const hotels = await Hotel.aggregate(pipeline);
    const allHotels = hotels;
    if (allHotels.length) {
      res.render("user/index.ejs", { allHotels });
    } else {
      res.render("user/no-result.ejs");
    }
  } catch (error) {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};
