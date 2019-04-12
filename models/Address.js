var db = require('../db');

var Address = {
    createAddress : function(Address,callback){
        var query = "INSERT INTO `address` (`idAddress`, `city`, `commun`, `state`, `street`, `zipcode`)"+ 
        "VALUES (NULL, ?, NULL, NULL, ?, Null);"
        db.query(query,[Address.city,Address.street],function(err,res){
            if(err){
                callback(err,null)
            }else{
                callback(null,res.insertId);
            }
        });
    },
     //Affichage de tt les services
     getAddress : function(callback){
        return db.query('SELECT distinct(city) FROM address',callback);
    }
}

module.exports = Address;