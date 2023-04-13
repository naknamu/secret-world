var express = require('express');
var router = express.Router();

const index_controller = require("../controller/indexController")

/* GET home page. */
router.get('/', index_controller.index_get);

module.exports = router;
