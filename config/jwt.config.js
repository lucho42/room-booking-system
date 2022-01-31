const secret = "0c2ee1d1-eb29-486d-baae-5b40f636cb6c"; //uuid (universally unique identifier)
const jwt = require("jsonwebtoken"); // JSON Web Token
const { findUserPerId } = require("../queries/user.queries");
const app = require("../app");

// MAC (message authentication code)
// H(message, secret) = MAC, avec H une fonction de hachage.
const createJwtToken = ({ user = null, id = null }) => {
  // payload convention : sub for unique id user, exp for expiraiton date
  // sign : create token
  const jwtToken = jwt.sign(
    {
      sub: id || user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, //5h
    },
    secret
    // { expiresIn: 60 * 60 * 5 } //second => 5h
  );
  return jwtToken;
};
exports.createJwtToken = createJwtToken;

// refresh token strategy (only if expiration less than 24h)
const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && nowInSec - tokenExp < 60 * 60 * 24) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    throw new Error("token expired");
  }
};

const decodeJwtToken = (token, res) => {
  let decodedToken = jwt.verify(token, secret, {
    ignoreExpiration: true,
  });
  decodedToken = checkExpirationToken(decodedToken, res);
  return decodedToken;
};

exports.decodeJwtToken = decodeJwtToken;

// middleware
const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      // verify : decode token
      const decodedToken = decodeJwtToken(token, res);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        // set user in request
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
      res.clearCookie("jwt");
      res.redirect("/");
    }
  } else {
    next();
  }
};

//Helpers
const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie("jwt", token);
  };
  next();
};

// apply middlewares for all requests
app.use(extractUserFromToken);
app.use(addJwtFeatures);
