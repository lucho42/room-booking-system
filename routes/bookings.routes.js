const router = require("express").Router();
const {
  bookingList,
  bookingCreate,
  bookingDelete,
  bookingFilteredList,
} = require("../controllers/bookings.controller");

router.get("/", bookingList);
router.get("/filteredList", bookingFilteredList);
router.post("/", bookingCreate);
router.delete("/:bookingId", bookingDelete);

module.exports = router;
