const {
  getBookingMap,
  createBooking,
  deleteBooking,
  getBooking,
} = require("../queries/booking.queries");
const { getUserMap } = require("../queries/user.queries");
const rooms = require("../database/dummy-data/rooms");
const times = require("../database/dummy-data/times");

exports.bookingList = async (req, res, next) => {
  try {
    const bookingMap = await getBookingMap();
    const userMap = await getUserMap();

    res.render("bookings/bookings", {
      bookingMap,
      userMap,
      rooms,
      times,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.bookingFilteredList = async (req, res, next) => {
  try {
    const bookingMap = await getBookingMap();
    const userMap = await getUserMap();
    const daytime = req.query.daytime;
    const userReservations = req.query.userReservations;
    const availableSlots = req.query.availableSlots;
    const filterCoke = req.query.coke;
    const filterPepsi = req.query.pepsi;
    const filterTimes = times.filter((time) => {
      if (daytime === "am") {
        return time <= 12;
      } else if (daytime === "pm") {
        return time > 12;
      } else {
        return true;
      }
    });

    res.render("bookings/booking-list", {
      bookingMap,
      userMap,
      rooms,
      times: filterTimes,
      filterUserId: userReservations === "true" ? req.user.id : null,
      availableSlots: availableSlots === "true",
      filterCoke: filterCoke === "true",
      filterPepsi: filterPepsi === "true",
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.bookingCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const { room, time } = await createBooking({
      ...body,
      employee: req.user._id,
    });
    const bookingMap = await getBookingMap();
    const userMap = await getUserMap();
    res.render("bookings/booking-slot", {
      bookingMap,
      userMap,
      room,
      time,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.bookingDelete = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const { room, time } = await getBooking(bookingId);
    await deleteBooking(bookingId);
    const bookingMap = await getBookingMap();
    const userMap = await getUserMap();
    res.render("bookings/booking-slot", {
      bookingMap,
      userMap,
      room,
      time,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};
