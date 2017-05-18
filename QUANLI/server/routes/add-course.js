var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.post('/', function(req, res, next) {
    var course  = JSON.parse(req.query.course);

    var sql =   "INSERT INTO courses(id, name, subject, word)" + 
				"VALUES('" + course.id + "','" + course.name + "', " + course.subject + " , " + course.word + " )";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
