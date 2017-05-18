var express = require('express');
var router = express.Router();
var connection = require('./../connectDB.js');

router.get('/', function(req, res, next) {
    var title    = req.query.title;
    var content  = req.query.content;
    var userid   = req.query.userid;

    var sql =   "INSERT INTO posts(title, content, userid)" + 
				"VALUES('" + title + "','" + content + "', " + userid + " )";

    connection.query(sql, function(error, result){
        var sql2 =   "SELECT posts.id,title,content,createdon,fullname,users.id as userid " +  
	    			"FROM posts,users WHERE posts.userid = users.id AND posts.id = " + result.insertId; 
	    connection.query(sql2, function(error, data){
	        res.end(JSON.stringify(data[0]));
	    });
    });
});

module.exports = router;
