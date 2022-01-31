window.addEventListener("DOMContentLoaded", () => {
  bindBookingActions();
});

function bindBookingActions() {
  const bookElements = document.querySelectorAll("button.booking-slot-book");
  const releaseElements = document.querySelectorAll(
    "button.booking-slot-release"
  );
  const bookingListContainer = document.querySelector(
    "#booking-list-container"
  );

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

  const filterDaytimeSelect = document.querySelector("#filter-daytime");
  const filterUserReservationsElement = document.querySelector(
    "#filter-user-reservations"
  );
  const filterAvailableSlotsElement = document.querySelector(
    "#filter-available-slots"
  );

  const filterCokeCompanyElement = document.querySelector(
    "#filter-coke-company"
  );

  const filterPepsiCompanyElement = document.querySelector(
    "#filter-pepsi-company"
  );

  filterDaytimeSelect.addEventListener("click", (e) => {
    const value = e.target.value;
    axios
      .get(
        "/bookings/filteredList?daytime=" +
          value +
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
  });

  filterUserReservationsElement.addEventListener("click", (e) => {
    const checked = e.target.checked;
    axios
      .get(
        "/bookings/filteredList?userReservations=" +
          checked +
          "&daytime=" +
          filterDaytimeSelect.value +
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
  });

  filterAvailableSlotsElement.addEventListener("click", (e) => {
    const checked = e.target.checked;
    axios
      .get(
        "/bookings/filteredList?availableSlots=" +
          checked +
          "&daytime=" +
          filterDaytimeSelect.value +
          "&userReservations=" +
          filterUserReservationsElement.checked +
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
  });

  filterCokeCompanyElement.addEventListener("click", (e) => {
    axios
      .get(
        "/bookings/filteredList?availableSlots=" +
          filterAvailableSlotsElement.checked +
          "&daytime=" +
          filterDaytimeSelect.value +
          "&userReservations=" +
          filterUserReservationsElement.checked +
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
  });

  filterPepsiCompanyElement.addEventListener("click", (e) => {
    axios
      .get(
        "/bookings/filteredList?availableSlots=" +
          filterAvailableSlotsElement.checked +
          "&daytime=" +
          filterDaytimeSelect.value +
          "&userReservations=" +
          filterUserReservationsElement.checked +
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
  });
}

ioClient.on("UPDATE_BOOKING_DASHBOARD", (data) => {
  const slotId = "#" + data.room + "-" + data.time;
  const slotContainer = document.querySelector(slotId);
  slotContainer.innerHTML = data.html;
  bindBookingActions();
});
