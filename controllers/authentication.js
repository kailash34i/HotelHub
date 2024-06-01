const User = require("../models/user.js"); // Require User model

//-------------- Admin Authentication -------------------

// Middlewares

module.exports.isAuthenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  } else {
    req.flash("error", "Admin authentication required.");
    return res.redirect("/admin/login");
  }
};

module.exports.isAdmin = async (req, res, next) => {
  let email = req.body.email;
  let user = await User.find({ email });
  if (user.length > 0 && user[0].role === "admin") {
    next();
  } else if (user.length === 0) {
    next();
  } else {
    req.flash(
      "error",
      "Admin account required. Please create an admin account before proceeding"
    );
    res.redirect("/admin/signup");
  }
};

// Admin signup

module.exports.renderAdminSignupForm = (req, res) => {
  res.render("admin/admin-signup.ejs", { hideSomeNavLink: true });
};

module.exports.adminSignup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let newUser = new User({
      role: "admin",
      name,
      email,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welocome to hotelhub!, Now setup your account.`);
      res.redirect("/admin/setup");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/signup");
  }
};

// Admin Login

module.exports.renderAdminLoginForm = (req, res) => {
  res.render("admin/admin-login.ejs", { hideSomeNavLink: true });
};

module.exports.adminLogin = (req, res) => {
  req.flash("success", "Welcome back!, You are loged in as admin");
  res.redirect("/admin/dashboard");
};
//-------------- User Authentication -------------------

// Middlewares

module.exports.isAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === "user") {
    return next();
  } else {
    req.flash("error", "User authentication required.");
    return res.redirect("/login");
  }
};

module.exports.isUser = async (req, res, next) => {
  let email = req.body.email;
  let user = await User.find({ email });
  if (user.length > 0 && user[0].role === "user") {
    next();
  } else if (user.length === 0) {
    next();
  } else {
    req.flash(
      "error",
      "Please login as admin since your account has administrative privileges."
    );
    res.redirect("/admin/login");
  }
};

// User Signup

module.exports.renderUserSignupForm = (req, res) => {
  res.render("user/signup.ejs", { hideSomeNavLink: true });
};

module.exports.userSignup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let newUser = new User({
      name,
      email,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welocome to hotelhub`);
      res.redirect("/explore");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// User Login

module.exports.renderUserLoginForm = (req, res) => {
  res.render("user/login.ejs", { hideSomeNavLink: true });
};

module.exports.userLogin = (req, res) => {
  req.flash("success", "Welcome back!, You are loged in");
  res.redirect("/explore");
};

//----------------- Logout Route---------------------

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are logged out");
      res.redirect("/explore");
    }
  });
};
