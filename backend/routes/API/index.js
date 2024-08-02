// backend/routes/api/index.js
const router = require("express").Router();

const { restoreUser, setTokenCookie } = require("../../utils/auth.js");

const { User } = require("../../db/models");

router.use(restoreUser);

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

router.get("/set-token-cookie", async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: "Demo-lition",
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

const addRoute = (name) => router.use("/" + name, require("./" + name));

addRoute("session");
addRoute("users");
addRoute("spots");
addRoute("reviews");
addRoute("bookings");
addRoute("spot-images");
addRoute("review-images");

module.exports = router;
