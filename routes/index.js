var express = require("express");
var router = express.Router();

const index_controller = require("../controller/indexController");

/* GET home page. */
router.get("/", index_controller.index_get);

// Delete message
router.post("/", index_controller.message_delete_post);

module.exports = router;
