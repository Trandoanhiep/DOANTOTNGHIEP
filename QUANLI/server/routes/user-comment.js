var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
    var content  = req.query.content;
    var postid = req.query.postid;
    var userid   = req.query.userid;

    var sql =   "INSERT INTO comments(content, postid, userid)" + 
				"VALUES('" + content + "', " + postid + " , " + userid + ")";

    connection.query(sql, function(error, result){
        var sql2 =  "SELECT comments.id,content,createdon,fullname,users.id as userid " +  
    				"FROM comments,users WHERE (comments.userid = users.id) AND postid = " + postid + " AND comments.id = " + result.insertId;

	    connection.query(sql2, function(error, data){
	        res.end(JSON.stringify(data[0]));
	    });
    });
});

module.exports = router;
