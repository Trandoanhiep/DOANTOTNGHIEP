var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.post('/', function(req, res, next) {
    var course  = JSON.parse(req.query.course);

    var sql =   "UPDATE courses SET name = '" + course.name + "', subject = " + course.subject + ", word = " + course.word + " " +
				"WHERE id = '" + course.id + "'";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
