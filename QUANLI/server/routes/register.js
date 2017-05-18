var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
    var email    = req.query.email;
    var password = req.query.password;
    var fullname = req.query.fullname;
    var type = req.query.type;

    var sql =   "INSERT INTO users(email, password, fullname, type)" + 
				"VALUES('" + email + "','" + password + "', '" + fullname + "', '" + type + "' )";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;