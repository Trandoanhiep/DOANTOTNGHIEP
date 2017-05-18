var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
	var limit = req.query.limit;
    var sql =   "SELECT posts.id,title,content,createdon,fullname,users.id as userid " +  
    			"FROM posts,users WHERE posts.userid = users.id " + 
    			"ORDER BY createdon DESC " +
    			"LIMIT " + limit;

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
