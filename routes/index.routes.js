const router = require("express").Router();
const authRoutes = require("./auth.routes");
const eventRoutes = require("./emergencyEvents.routes");
/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// router.use("/events", eventRoutes);
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);


module.exports = router;
