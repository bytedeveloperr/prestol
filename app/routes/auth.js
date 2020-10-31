const express = require("express");
const router = express.Router();

const render = require("../controllers/auth/renders");
const handler = require("../controllers/auth/handlers");
const ensureGuest = require("../middlewares/ensureGuest");

router.get("/signup", ensureGuest, render.signup);
router.get("/login", ensureGuest, render.login);
router.post("/signup", ensureGuest, handler.signup);
router.post("/login", ensureGuest, handler.login);

module.exports = router;
