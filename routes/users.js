var express = require('express');
var router = express.Router();

// Require user modules
const user_controller = require("../controller/userController");

// GET request for Sign up form 
router.get('/signup', user_controller.user_create_get);

// POST request for Sign up form 
router.post('/signup', user_controller.user_create_post);

module.exports = router;
