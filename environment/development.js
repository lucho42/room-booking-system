const path = require("path");
const globalConfig = require("../config/global.config");

module.exports = {
  dbUrl: `mongodb+srv://${globalConfig.mongoUser}:${globalConfig.mongoPassword}@cluster0.ubbtb.mongodb.net/room-booking-db?retryWrites=true&w=majority`,
  cert: path.join(__dirname, "../ssl/local.crt"), //path to certificate
  key: path.join(__dirname, "../ssl/local.key"), // path to certificate private key
  portHttp: 3000,
  portHttps: 3001,
};
