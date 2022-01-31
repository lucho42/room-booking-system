const { findByIdAndDelete } = require("../database/models/booking.model");
const Booking = require("../database/models/booking.model");

exports.getBookingMap = async () => {
  const bookingMap = new Map();
  const bookings = await Booking.find({}).populate("employee").exec();
  if (bookings) {
    bookings.forEach((booking) => {
      if (!bookingMap.has(booking.room)) {
        bookingMap.set(booking.room, new Map());
      }
      bookingMap.get(booking.room).set(booking.time, {
        id: booking._id.toString(),
        room: booking.room,
        time: booking.time,
        employee: booking.employee,
        employeeId: booking.employee ? booking.employee._id.toString() : null,
        company: booking.employee ? booking.employee.company : null,
      });
    });
  }
  return bookingMap;
};

exports.createBooking = (booking) => {
  const newBooking = new Booking(booking);
  return newBooking.save();
};

exports.deleteBooking = (bookingId) => {
  return Booking.findByIdAndDelete(bookingId).exec();
};

exports.getBooking = (bookingId) => {
  return Booking.findOne({ _id: bookingId }).exec();
};
