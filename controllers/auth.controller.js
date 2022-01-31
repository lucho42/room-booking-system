const { findUserPerEmail } = require("../queries/user.queries");

exports.signinForm = (req, res, next) => {
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect("/");
      } else {
        res.render("auth/auth-form", { errors: ["Wrong password"] });
      }
    } else {
      res.render("auth/auth-form", { errors: ["User not found"] });
    }
  } catch (error) {
    next(error);
  }
};

exports.signout = (req, res, next) => {
  req.logout();
  res.redirect("/auth/signin/form");
};
