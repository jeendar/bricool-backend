var db = require('../db');

var Metier = {
    //Création d'un nouveau métier
    createMetier : function(Metier,callback){
        var query = "INSERT INTO `metier` (`idMetier`,`nameMetier`)"+ 
        "VALUES (NULL, ?);"
        db.query(query,[Metier.nameMetier],function(err,res){
            if(err){
                callback(err,null)
            }else{
                callback(null,res);
            }
        });
    }, 
    //Affichage
    getMetiers : function(callback){
        return db.query('select * from metier',callback);
    },

    updateMetier : function(Metier,callback){
        var query = "UPDATE `metier` set "+ 
        " `nameMetier`=? WHERE `idMetier`= ? ;"
        db.query(query,[Metier.nameMetier,Metier.idMetier],function(err,res){
            if(err){
                console.log("UPDATE NOT DONE..");
                callback(err,null)
            }else{
                console.log("UPDATE DONE..");
                callback(null,res);
            }
        });
    }, 

    metierExist : function(Metier,callback){
        var query = "Select nameMetier from metier where nameMetier like ?;";
        db.query(query,[Metier.name],function(err,fields){
            if(err)
            callback(err,null);
            else{
                result = false;
                if(fields.length > 0){
                    result = true;
                }
                callback(null,{exist : result});
            }
        });
    },
    /////////////////////////////////////////////////////////
    deleteMetier : function(Metier,callback){
        console.log(Metier.idMetier);
        db.query("delete from metier where idMetier=?",[Metier.idMetier],function(err,res){
        if(err){
            console.log("delete not done");
            callback(err,null)
        }else{
            console.log("delete done");
            callback(null,res);
        }
    });
    }

}
module.exports = Metier;
