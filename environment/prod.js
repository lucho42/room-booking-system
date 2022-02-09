const path = require("path");
const globalConfig = require("../config/global.config");

module.exports = {
  dbUrl: `mongodb+srv://${globalConfig.mongoUser}:${globalConfig.mongoPassword}@cluster0.ubbtb.mongodb.net/room-booking-db?retryWrites=true&w=majority`,
  cert: path.join(__dirname, ""),
  key: path.join(__dirname, ""),
  portHttp: 80,
  portHttps: 443,
};
