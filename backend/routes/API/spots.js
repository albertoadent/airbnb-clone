const route = require("../../utils/route");
const {
  get,
  post,
  put,
  del,
  throwError,
  catchRoute,
  router,
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  User,
  Booking,
  Sequelize,
} = route();

get(
  "/",
  { requireAuth: false, exists: false, validation: "spotquery" },
  async ({ query }) => {
    let {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
    } = query;
    page = parseInt(page);
    size = parseInt(size);

    const options = { where: {} };
    options.limit = size > 20 ? 20 : size;
    options.offset = options.limit * (page - 1);

    if (minLat) {
      options.where.lat = { [Sequelize.Op.gte]: minLat };
    }
    if (maxLat) {
      options.where.lat = { [Sequelize.Op.lte]: maxLat };
    }

    if (minLat && maxLat) {
      options.where.lat = {
        [Sequelize.Op.and]: [
          { [Sequelize.Op.gte]: minLat },
          { [Sequelize.Op.lte]: maxLat },
        ],
      };
    }

    if (minLng) {
      options.where.lng = { [Sequelize.Op.gte]: minLng };
    }
    if (maxLng) {
      options.where.lng = { [Sequelize.Op.lte]: maxLng };
    }

    if (minLng && maxLng) {
      options.where.lng = {
        [Sequelize.Op.and]: [
          { [Sequelize.Op.gte]: minLng },
          { [Sequelize.Op.lte]: maxLng },
        ],
      };
    }

    if (minPrice) {
      options.where.price = { [Sequelize.Op.gte]: minPrice };
    }
    if (maxPrice) {
      options.where.price = { [Sequelize.Op.lte]: maxPrice };
    }

    if (minPrice && maxPrice) {
      options.where.price = {
        [Sequelize.Op.and]: [
          { [Sequelize.Op.gte]: minPrice },
          { [Sequelize.Op.lte]: maxPrice },
        ],
      };
    }

    const Spots = await Spot.findAll({
      ...options,
      attributes: { include: ["createdAt", "updatedAt"] },
    });
    return { Spots };
  }
);

get("/current", { requireAuth: true }, async ({ user }) => {
  const other = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
    attributes: {
      include: ["createdAt", "updatedAt"],
    },
  });
  // const Spots = await user.getSpots({
  //   attributes: {
  //     include: ["createdAt", "updatedAt"],
  //   },
  // });
  return { Spots: other };
});

get(
  "/:spotId",
  {
    requireAuth: false,
    exists: {
      attributes: {
        include: ["createdAt", "updatedAt"],
      },
      include: [
        { model: SpotImage, attributes: ["id", "url", "preview"] },
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
        { model: Review, attributes: ["id"] },
      ],
    },
  },
  async ({ spot }) => {
    const data = { ...spot.toJSON(), numReviews: spot.toJSON().Reviews.length };
    delete data.Reviews;
    return data;
  }
);

post(
  "/",
  { requireAuth: true, exists: false, validation: "Spot" },
  async ({ user, body }) => {
    const spot = await Spot.create({ ...body });
    const { images = [] } = body;
    const { id } = spot.toJSON();

    // console.log(images, id);

    if (images?.length > 0) {
      const promises = images.map(async (image) => {
        return SpotImage.create({
          spotId: id,
          url: image,
          preview: false,
        });
      });
      await Promise.all(promises);
    }

    return spot;
  }
);

post("/:spotId/images", { authorization: true }, async ({ spot, body }) => {
  const totalImages = await spot.getSpotImages();

  if (totalImages.length >= 10) {
    throwError(403, "Maximum number of images for this resource was reached");
  }

  const data = await spot.createSpotImage(body);
  return data;
});

put(
  "/:spotId",
  {
    exists: { attributes: { include: ["createdAt", "updatedAt"] } },
    authorization: true,
    validation: "Spot",
  },
  async ({ spot, body }) => {
    const { images } = body;

    const existingImages = await spot.getSpotImages({
      where: {
        preview: false,
      },
    });
    const discardedUrls = {};

    existingImages.forEach((image) => {
      const { url, id } = image.toJSON();
      const existsIndex = images.indexOf(url);
      if (existsIndex + 1) {
        discardedUrls[url] = id;
      } else {
        images[existsIndex] = undefined;
      }
    });

    const promises = images
      .filter((e) => !!e)
      .map(async (image, index) => {
        const toChangeArr = Object.values(discardedUrls);
        if (toChangeArr[index]) {
          const image = await SpotImage.findByPk(toChangeArr[index]);
          await image.update({ ...image.toJSON(), url: image.toJSON().url });
        } else {
          await spot.createSpotImage({ url: image, preview: false });
        }
      });

    await Promise.all(promises);

    return spot.update(body);
  }
);
del(
  "/:spotId",
  { authorization: true },
  async ({ spot }) =>
    spot.destroy() && {
      message: "Successfully deleted",
    }
);

get(
  "/:spotId/reviews",
  { requireAuth: false, exists: true },
  async ({ spot }) => {
    const Reviews = await spot.getReviews({
      attributes: {
        include: ["createdAt", "updatedAt"],
      },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
    });
    return { Reviews };
  }
);

post(
  "/:spotId/reviews",
  { requireAuth: true, exists: true, validation: "Review" },
  async ({ spot, body, user }) => {
    const [data, wasCreated] = await Review.findOrCreate({
      where: { userId: user.id, spotId: spot.id },
      defaults: { ...body, userId: user.id, spotId: spot.id },
    });
    if (wasCreated) {
      return data;
    }
    throw new Error("User already has a review for this spot");
  }
);

get(
  "/:spotId/bookings",
  { requireAuth: true, authorization: { spot: true } },
  async ({ spot }) => {
    const Bookings = await spot.getBookings({
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      attributes: {
        include: ["createdAt", "updatedAt"],
      },
    });
    return { Bookings };
  }
);

catchRoute(
  "/:spotId/bookings",
  { requireAuth: true },
  async ({ spot, user }) => {
    const Bookings = await spot.getBookings({
      attributes: ["spotId", "startDate", "endDate"],
      where: {
        userId: user.id,
      },
    });
    return { Bookings };
  },
  "GET"
);

post(
  "/:spotId/bookings",
  {
    validation: "Booking",
  },
  async ({ spot, body, user }) => {
    if (spot.ownerId === user.id) {
      throwError(403);
    }
    const formatDate = (date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
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
      },
    });

    if (Bookings[0]) {
      const confilctingBooking = Bookings[0].toJSON();
      const errors = {};
      if (
        startDate <= confilctingBooking.endDate &&
        startDate >= confilctingBooking.startDate
      ) {
        errors.startDate = "Start date conflicts with an existing booking";
      }
      if (
        endDate <= confilctingBooking.endDate &&
        endDate >= confilctingBooking.startDate
      ) {
        errors.endDate = "End date conflicts with an existing booking";
      }
      if (!errors.startDate && !errors.endDate) {
        errors.startDate = "Start date conflicts with an existing booking";
        errors.endDate = "End date conflicts with an existing booking";
      }
      throwError(
        403,
        "Sorry, this spot is already booked for the specified dates",
        errors
      );
    }

    const booking = await Booking.create({
      startDate,
      endDate,
      userId: user.id,
      spotId: spot.id,
    });

    return booking;
  }
);

module.exports = router;
