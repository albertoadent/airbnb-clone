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
} = route();

get("/current", { requireAuth: true }, async ({ user }) => {
  const Reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    attributes: { include: ["createdAt", "updatedAt"] },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Spot, attributes: { include: ["createdAt", "updatedAt"] } },
      {
        model: ReviewImage,
        attributes: { include: ["createdAt", "updatedAt"] },
      },
    ],
  });

  // const Reviews = reviews.map((rev) => rev.toJSON());

  for (rev of Reviews) rev.Spot.previewImage = await rev.Spot.getPreviewImage();

  return { Reviews };
});

post(
  "/:reviewId/images",
  { authorization: true },
  async ({ review, user, body }) => {
    const totalImages = await review.getReviewImages();

    if (totalImages.length >= 10) {
      throwError(403, "Maximum number of images for this resource was reached");
    }

    const data = await review.createReviewImage({ ...body, userId: user.id });

    return data;
  }
);
put(
  "/:reviewId",
  {
    exists: { attributes: { include: ["createdAt", "updatedAt"] } },
    authorization: true,
    validation: "Review",
  },
  async ({ review, body }) => {
    const data = await review.update(body);
    return data;
  }
);
del("/:reviewId", { authorization: true }, async ({ review }) => {
  const data = await review.destroy();
  return {
    message: "Successfully deleted",
  };
});

module.exports = router;
