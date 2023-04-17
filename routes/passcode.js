var express = require("express");
var router = express.Router();

const passcode_controller = require("../controller/passcodeController");

// GET request for Passcode Enter
router.get("/", passcode_controller.passcode_enter_get);

// POST request for Passcode Enter
router.post("/", passcode_controller.passcode_enter_post);

module.exports = router;
