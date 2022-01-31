const router = require("express").Router();
const bookings = require("./bookings.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");
const { ensureAuthenticated } = require("../config/guards.config");

// Mount /auth URI router instance
router.use("/auth", auth);
// Mount /users URI router instance
router.use("/users", users);
// Mount /bookings URI router instance
router.use("/bookings", ensureAuthenticated, bookings);

// Redirection
router.get("/", (req, res) => {
  //   console.log({ user: req.user });
  res.redirect("/bookings");
});

module.exports = router;
