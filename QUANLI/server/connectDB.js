var mysql      = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'myapp',
});

module.exports = connection;