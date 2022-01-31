const path = require('path')

module.exports = {
    dbUrl: 'mongodb+srv://luc:colapass@cluster0.ubbtb.mongodb.net/room-booking-db?retryWrites=true&w=majority',
    cert: path.join(__dirname, ''),
    key: path.join(__dirname, ''),
    portHttp: 80,
    portHttps: 443,
}
