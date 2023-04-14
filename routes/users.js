var express = require('express');
var router = express.Router();
const passport = require("passport");

// Require user modules
const user_controller = require("../controller/userController");

// GET request for Sign up form 
router.get('/signup', user_controller.user_create_get);

// POST request for Sign up form 
router.post('/signup', user_controller.user_create_post);

// GET request for Log out
router.get("/log-out", user_controller.user_logout_get);

// GET request for Log IN
router.get("/log-in", user_controller.user_login_get);

// POST request for Log IN
router.post("/log-in", user_controller.user_login_post);

module.exports = router;
