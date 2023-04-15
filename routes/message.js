var express = require('express');
var router = express.Router();

const message_controller = require("../controller/messageController")

// GET request for Passcode Enter
router.get('/', message_controller.message_create_get);

// POST request for Passcode Enter
// router.post('/', passcode_controller.passcode_enter_post);

module.exports = router;