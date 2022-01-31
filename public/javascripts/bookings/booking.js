//filters
let filterDaytimeSelect,
  filterUserReservationsElement,
  filterAvailableSlotsElement,
  filterCokeCompanyElement,
  filterPepsiCompanyElement;

//buttons book/release
let bookElements, releaseElements;
//booking list
let bookingListContainer;

window.addEventListener("DOMContentLoaded", () => {
  bindFilterActions();
  bindBookingActions();
});

function bindFilterActions() {
  filterDaytimeSelect = document.querySelector("#filter-daytime");
  filterUserReservationsElement = document.querySelector(
    "#filter-user-reservations"
  );
  filterAvailableSlotsElement = document.querySelector(
    "#filter-available-slots"
  );
  filterCokeCompanyElement = document.querySelector("#filter-coke-company");
  filterPepsiCompanyElement = document.querySelector("#filter-pepsi-company");

  filterDaytimeSelect.addEventListener("change", (e) => {
    console.log("filterDaytimeSelect");
    applyFilters();
  });
  filterUserReservationsElement.addEventListener("click", (e) => {
    console.log("filterUserReservationsElement");
    applyFilters();
  });
  filterAvailableSlotsElement.addEventListener("click", (e) => {
    console.log("filterAvailableSlotsElement");
    applyFilters();
  });
  filterCokeCompanyElement.addEventListener("click", (e) => {
    console.log("filterCokeCompanyElement");
    applyFilters();
  });
  filterPepsiCompanyElement.addEventListener("click", (e) => {
    console.log("filterPepsiCompanyElement");
    applyFilters();
  });
}

function bindBookingActions() {
  bookElements = document.querySelectorAll("button.booking-slot-book");
  releaseElements = document.querySelectorAll("button.booking-slot-release");
  bookingListContainer = document.querySelector("#booking-list-container");

  bookElements.forEach((e) => {
    e.addEventListener("click", ($event) => {
      const room = $event.target.getAttribute("room");
      const time = $event.target.getAttribute("time");
      const userId = $event.target.getAttribute("user-id");
      axios
        .post("/bookings", { room, time })
        .then(function (response) {
          const slotId = "#" + room + "-" + time;
          const slotContainer = document.querySelector(slotId);
          slotContainer.innerHTML = response.data;
          ioClient.emit("BOOKING_DASHBOARD_CHANGED", { room, time, userId });
          bindBookingActions();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  });

  releaseElements.forEach((e) => {
    e.addEventListener("click", ($event) => {
      const room = $event.target.getAttribute("room");
      const time = $event.target.getAttribute("time");
      const userId = $event.target.getAttribute("user-id");
      const bookingId = $event.target.getAttribute("booking-id");
      axios
        .delete("/bookings/" + bookingId)
        .then(function (response) {
          const slotId = "#" + room + "-" + time;
          const slotContainer = document.querySelector(slotId);
          slotContainer.innerHTML = response.data;
          ioClient.emit("BOOKING_DASHBOARD_CHANGED", { room, time, userId });
          bindBookingActions();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  });
}

function applyFilters() {
  axios
    .get(
      "/bookings/filteredList?daytime=" +
        filterDaytimeSelect.value +
        "&userReservations=" +
        filterUserReservationsElement.checked +
        "&availableSlots=" +
        filterAvailableSlotsElement.checked +
        "&coke=" +
        filterCokeCompanyElement.checked +
        "&pepsi=" +
        filterPepsiCompanyElement.checked
    )
    .then((response) => {
      bookingListContainer.innerHTML = response.data;
      bindBookingActions();
    })
    .catch((err) => {
      console.log(err);
    });
}

// web socket listening
ioClient.on("UPDATE_BOOKING_DASHBOARD", (data) => {
  const slotId = "#" + data.room + "-" + data.time;
  const slotContainer = document.querySelector(slotId);
  slotContainer.innerHTML = data.html;
  bindBookingActions();
});
