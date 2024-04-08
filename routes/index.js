const router = require("express").Router();
const user = require("./users");
const song = require("./song");
const NotFoundError = require("../utils/NotFoundError");

router.use("/users", user);

router.use("/items", song);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
