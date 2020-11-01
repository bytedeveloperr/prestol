const express = require("express");
const router = express.Router();

const render = require("../controllers/user/renders");
const handler = require("../controllers/user/handlers");
const ensureAuth = require("../middlewares/ensureAuth");
const upload = require("../config/upload");

router.get("/:id", render.profile);
router.put("/:id", ensureAuth, upload.single("profileImage"), handler.update);

module.exports = router;
