const express = require("express");
const router = express.Router();
const auth = require("./auth");
const user = require("./user");
const post = require("./post");
const main = require("../controllers/main/renders");
const ensureAuth = require("../middlewares/ensureAuth");

router.get("/", ensureAuth, main.home);
router.get("/notifications", ensureAuth, main.notifs);
router.use("/", auth);
router.use("/post", post);
router.use("/user", user);
router.get("/logout", main.logout);

module.exports = router;
