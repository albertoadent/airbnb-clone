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

del("/:spotImageId", { requireAuth: true }, async ({ spotImage, user }) => {
  const spot = await spotImage.getSpot();
  const isOwner = user.id === spot.toJSON().ownerId;
  if (!isOwner) throwError(403);
  return (
    spotImage.destroy() && {
      message: "Successfully deleted",
    }
  );
});

module.exports = router;
