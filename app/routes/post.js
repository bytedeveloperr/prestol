const express = require("express");
const router = express.Router();

const render = require("../controllers/post/renders");
const handler = require("../controllers/post/handlers");
const ensureAuth = require("../middlewares/ensureAuth");
const upload = require("../config/upload");

router.post(
	"/create",
	ensureAuth,
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "video", maxCount: 1 },
	]),
	handler.create
);
router.get("/:id", render.show);
router.put("/:id", ensureAuth, handler.update);
router.delete("/:id", ensureAuth, handler.delete);

module.exports = router;
