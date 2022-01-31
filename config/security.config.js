const cookieParser = require("cookie");
const { decodeJwtToken } = require("./jwt.config");
const { findUserPerId } = require("../queries/user.queries");

exports.ensureAuthenticatedOnSocketHandshake = async (request, success) => {
  try {
    const cookies = cookieParser.parse(request.headers.cookie || "");
    if (cookies && cookies.jwt) {
      // check and verify token
      const decodedToken = decodeJwtToken(cookies.jwt);
      // get user with user id from token
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        // we set user on request (we cannot use express middleware with websocket because we use node server http)
        request.user = user;
        // success, authorize handshake
        success(null, true);
      } else {
        // No user in db, we refuse handshake
        success(400, false);
      }
    } else {
      // No cookie, request not authenticated, we refuse handshake
      success(403, false);
    }
  } catch (e) {
    console.log(e);
    // Error during verification, we refuse handshake
    success(400, false);
  }
};
