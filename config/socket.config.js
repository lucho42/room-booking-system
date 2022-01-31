const socketio = require("socket.io");
const server = require("../bin/www");
const { ensureAuthenticatedOnSocketHandshake } = require("./security.config");

const rooms = require("../database/dummy-data/rooms");
const times = require("../database/dummy-data/times");
const app = require("../app");

const { getBookingMap } = require("../queries/booking.queries");
const { getUserMap } = require("../queries/user.queries");

const initSocketServer = () => {
  ios = socketio(server, {
    //during handshake on HTTP (not on WebSocket)
    allowRequest: ensureAuthenticatedOnSocketHandshake,
  });
  ios.on("connect", (socket) => {
    console.log("server websocket connexion ok !");
    socket.on("BOOKING_DASHBOARD_CHANGED", async (obj) => {
      try {
        const room = obj.room;
        const time = parseInt(obj.time);

        //send to all
        // ios.emit("UPDATE_BOOKING", booking);
        //to all except sender
        // socket.broadcast.emit("UPDATE_BOOKING_DASHBOARD", booking);

        const bookingMap = await getBookingMap();
        const userMap = await getUserMap();
        app.render(
          "bookings/booking-slot",
          {
            bookingMap,
            userMap,
            room,
            time,
            isAuthenticated: !!socket.request.user,
            // currentUser: socket.request.user,
            currentUser: userMap.get(obj.userId),
          },
          function (err, html) {
            if (err) {
              console.log(err);
            } else {
              socket.broadcast.emit("UPDATE_BOOKING_DASHBOARD", {
                html,
                room,
                time,
              });
            }
          }
        );
      } catch (e) {
        throw e;
      }
    });
  });
};

// launch socket.io server
initSocketServer();
