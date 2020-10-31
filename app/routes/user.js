const express = require("express");
const router = express.Router();

const render = require("../controllers/user/renders");
const handler = require("../controllers/user/handlers");
const ensureAuth = require("../middlewares/ensureAuth");
const upload = require("../config/upload");

// router.post(
// 	"/create",
// 	ensureAuth,
// 	upload.fields([
// 		{ name: "image", maxCount: 1 },
// 		{ name: "video", maxCount: 1 },
// 	]),
// 	handler.create
// );
router.get("/:id", render.profile);
router.put("/:id", ensureAuth, upload.single("profileImage"), handler.update);
// router.delete("/:id", ensureAuth, handler.delete);

module.exports = router;
