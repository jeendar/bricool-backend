var mysql      = require('mysql2');
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bricool3'
});
module.exports=connection;