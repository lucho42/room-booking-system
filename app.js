const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const index = require("./routes");
const errorHandler = require("errorhandler");
// init mongodb connection
require("./database");

const app = express();
module.exports = app; // export for session config and www

//JSON Web token (JWT) Authentication
app.use(cookieParser());
require("./config/jwt.config");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/* Middlewares */
//logger
app.use(morgan("short"));
//statics assets
app.use(express.static(path.join(__dirname, "public")));
//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Router */
app.use(index);

/* Error handling */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message,
    });
  });
}

// const port = process.env.PORT || 3000
// app.listen(port)
