const route = require("../../utils/route");
const {
  get,
  post,
  put,
  del,
  throwError,
  router,
  Spot,
  Review,
  SpotImage,
  ReviewImage,
  User,
  Sequelize,
} = route();

get("/current", { requireAuth: true }, async ({ user }) => {
  const Bookings = await user.getBookings({
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
    include: { model: Spot },
  });
  for (book of Bookings) {
    book.Spot.previewImage = await book.Spot.getPreviewImage();
  }
  return { Bookings };
});

put(
  "/:bookingId",
  { authorization: true, validation: "Booking" },
  async ({ booking, body, user }) => {
    const spot = await booking.getSpot();
    const formatDate = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const startDate = formatDate(new Date(body.startDate));
    const endDate = formatDate(new Date(body.endDate));

    const Bookings = await spot.getBookings({
      where: {
        startDate: {
          [Sequelize.Op.lte]: endDate,
        },
        endDate: {
          [Sequelize.Op.gte]: startDate,
        },
        id: { [Sequelize.Op.not]: booking.id },
      },
    });

    const bookingEnd = new Date(booking.toJSON().endDate);
    const today = new Date();

    if (bookingEnd < today) {
      throwError(403, "Past bookings can't be modified");
    }

    if (Bookings[0]) {
      throwError(
        403,
        "Sorry, this spot is already booked for the specified dates"
      );
    }

    return booking.update({ ...body, userId: user.id });
  }
);

del(
  "/:bookingId",
  { authorization: { bookings: true, spot: true } },
  async ({ booking }) => {
    const { startDate, endDate } = booking.toJSON();
    const today = new Date();

    if (today > startDate && today < endDate) {
      throwError(403, "Bookings that have been started can't be deleted");
    }

    return (
      booking.destroy() && {
        message: "Successfully deleted",
      }
    );
  }
);

module.exports = router;
