var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
    var email    = req.query.email;
    var password = req.query.password;
    var type = req.query.type;

    var sql = "SELECT * FROM users WHERE (email = '" + email + "') AND (password =  '" + password + "') AND (type =  " + type + ")";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
