console.log("Hello World");
//------------ Express Setup -------------

const express = require("express");
const app = express();

//----------- dotenv Setup --------------

require("dotenv").config();

//----------- MongoDB Setup ------------

const mongoose = require("mongoose");
const dbUrl = process.env.ATLAS_URL;
main()
  .then(() => {
    console.log("DB connection established.");
  })
  .catch((err) => {
    console.log("Error in esablishing connection to DB: ", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const User = require("./models/user.js"); // Require User model
const Hotel = require("./models/hotel.js"); // Require Hotel model
const Room = require("./models/room.js"); // Require Room model
const Review = require("./models/review.js"); // Require Review model
const Booking = require("./models/booking.js"); // Require Booking model

//------------ EJS Setup -------------

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

//------------- EJS Mate Setup --------------

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//------------ URL Data Parsing Setup -------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//------------ Method Override Setup ----------

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//------------ Static File Setup ------------

app.use(express.static(path.join(__dirname, "public")));

//------------ Mongo Session Store -----------------

const session = require("express-session");
const MongoStore = require("connect-mongo");
const secret = process.env.SECRET;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret,
  },
  touchAfter: 86400,
});

store.on("error", (error) => {
  console.log(error);
});

//--------- Express Session, Authentication & Flash Setup -----------

const passport = require("passport");
const LocalStrategy = require("passport-local");

const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

const flash = require("connect-flash");
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//------- Multer For Parsing File Data -------

const multer = require("multer");
let upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));

//----------- Geocoding Setup For Maps-----------

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//-------------- Authentication -------------------

const authentication = require("./controllers/authentication.js");

// Admin signup

app.get("/admin/signup", authentication.renderAdminSignupForm);
app.post("/admin/signup", authentication.adminSignup);

// Admin login

app.get("/admin/login", authentication.renderAdminLoginForm);
app.post(
  "/admin/login",
  authentication.isAdmin,
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  authentication.adminLogin
);

// User signup

app.get("/signup", authentication.renderUserSignupForm);
app.post("/signup", authentication.userSignup);

// User login

app.get("/login", authentication.renderUserLoginForm);
app.post(
  "/login",
  authentication.isUser,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  authentication.userLogin
);

// User logout

app.get("/logout", authentication.logout);

//------------- Admin Routes ----------------

const admin = require("./controllers/admin.js");

// Admin index route

app.get("/admin", admin.index);

// Hotel setup route

app.get(
  "/admin/setup",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.renderSetupForm
);

app.post(
  "/admin/setup",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  upload.array("hotel[image]", 3),
  admin.setupHotel
);

// Hotel edit route

app.get(
  "/admin/hotel/:id",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.renderHotelEditForm
);

app.put(
  "/admin/hotel/:id",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.editHotelInfo
);

// Admin dashboard

app.get(
  "/admin/dashboard",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.dashboard
);

// New room route

app.get(
  "/admin/new-room",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.renderNewRoomForm
);

app.post(
  "/admin/new-room",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  upload.array("room[roomImage]", 3),
  admin.createNewRoom
);

// Edit room route

app.get(
  "/admin/room/:id",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.renderRoomEditForm
);

app.put(
  "/admin/room/:id",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.editRoomInfo
);

// Delete Route

app.delete(
  "/admin/:hotelId/room/:roomId",
  authentication.isAuthenticatedAdmin,
  admin.isSetupCompleted,
  admin.deleteRoom
);

// Show all bookings for admin

app.get(
  "/admin/bookings",
  authentication.isAuthenticatedAdmin,
  admin.showAllBookings
);

// Booking search route

app.get(
  "/admin/bookings/search",
  authentication.isAuthenticatedAdmin,
  admin.searchByBookingId
);

// Mark booking completed

app.post(
  "/admin/booking/:bookingId/complete",
  authentication.isAuthenticatedAdmin,
  admin.markAsCheckout
);

// //--------------User Routes-------------------

const user = require("./controllers/user.js");

// Index route

app.get("/", user.index);

app.get("/explore", user.explore);

// Filters routes

const filters = require("./controllers/filters.js");

app.get("/explore/popular", filters.popular);

app.get("/explore/luxury", filters.luxury);

app.get("/explore/lakefront", filters.lakefront);

app.get("/explore/mountain", filters.mountain);

app.get("/explore/beach", filters.beach);

app.get("/explore/amazing-views", filters.amazingViews);

app.get("/explore/amazing-pools", filters.amazingPools);

app.get("/explore/cities", filters.cities);

app.get("/explore/countryside", filters.countryside);

// Filters base on filter form

app.post("/explore/filter", filters.filterFormResult);

// Seach route

const search = require("./controllers/search.js");
app.get("/search", search.serachFunction);

// Show Route

app.get("/explore/:id", user.showHotel);

app.get(
  "/explore/:hotelId/:roomId/booking",
  authentication.isAuthenticatedUser,
  user.renderBookingPage
);

// Handling booking routes

app.post(
  "/explore/:hotelId/:roomId/booking",
  authentication.isAuthenticatedUser,
  user.bookingAndPayment
);

// Deleting booking details if payment failed

app.delete("/explore/booking/:bookingId", user.deleteBookingDetails);

// Bookings show route for users

app.get("/bookings", authentication.isAuthenticatedUser, user.bookings);

//---------------- Review Routes -----------------

const review = require("./controllers/review.js");

// Create route

app.post(
  "/explore/:id/reviews",
  authentication.isAuthenticatedUser,
  review.createReview
);

app.delete(
  "/explore/:id/reviews/:reviewId",
  authentication.isAuthenticatedUser,
  review.deleteReview
);

//------ Handling undefined api requests -------

app.get("/*", (req, res) => {
  res.render("user/no-result.ejs");
});

//--------- Connection Establishment -----------

app.listen(8080, () => {
  console.log("App is listening on port 8080.");
});
