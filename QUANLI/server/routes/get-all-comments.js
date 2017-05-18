var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
	var limit = req.query.limit;
	var postid = req.query.postid;
    var sql =   "SELECT comments.id,content,createdon,fullname,users.id as userid " +  
    			"FROM comments,users WHERE (comments.userid = users.id) AND postid = " + postid + 
    			" LIMIT " + limit;

    connection.query(sql, function(error, result){
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
