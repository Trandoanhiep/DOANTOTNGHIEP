var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
    var id    = req.query.id;

    var sql = "SELECT * FROM courses WHERE id = '" + id + "' ";

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
