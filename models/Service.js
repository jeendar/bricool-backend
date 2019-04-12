var db = require('../db');

var Service = {
    
    //Création d'un nouveau service
    createService : function(Service,callback){
        var query = "INSERT INTO `service` (`idService`,`idMetier`,`name_service`)"+ 
        "VALUES (NULL,?,?);"
        db.query(query,[Service.idMetier,Service.name_service],function(err,res){
            if(err){
                console.log("CREATION NOT DONE..");
                callback(err,null)
            }else{
                console.log("CREATION DONE..");
                callback(null,res);
            }
        });
    }, 

    //Affichage de tt les services
    getServices : function(callback){
        return db.query('SELECT * FROM service s, metier m where m.idMetier=s.idMetier',callback);
    },
    updateService : function(Service,callback){
        var query = "update `service`set "+ 
        "`name_service`=? WHERE `idService`= ? ;"
        db.query(query,[Service.nameService,Service.idService],function(err,res){
            if(err){
                console.log("UPDATE NOT DONE..");
                callback(err,null)
            }else{
                console.log("UPDATE DONE..");
                callback(null,res);
            }
        });
    },
//************************** */
    getServiceByIdMetier: function(Service,callback){
        db.query("Select * FROM Service where idMetier =?",[Service.idMetier],callback);
    },
//////////////////////////////////////////////////////////////
    deleteService : function(Service,callback){
        console.log(Service);
        db.query("DELETE from service where idService=?",[Service.idService],function(err,res){
        if(err){
            console.log("DELETE NOT DONE..");
            callback(err,null)
        }else{
            console.log("DELETE DONE..");
            callback(null,res);
        }
    });
}
}
module.exports = Service;
