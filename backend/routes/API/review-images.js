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

del(
  "/:reviewImageId",
  {
    requireAuth: true,
    exists: {
      include: {
        model: Review,
      },
    },
  },
  async ({ reviewImage, user }) => {
    const isOwner = user.id === reviewImage.Review.userId;
    if (!isOwner) throwError(403);
    return (
      reviewImage.destroy() && {
        message: "Successfully deleted",
      }
    );
  }
);

module.exports = router;