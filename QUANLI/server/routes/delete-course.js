
var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.post('/', function(req, res, next) {
    var courseId  = req.query.id;

    var sql =   "DELETE FROM courses WHERE id = '" + courseId + "'";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
