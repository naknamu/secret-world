var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    user: res.locals.currentUser,
    errors: undefined,
  });
});

module.exports = router;
