var db = require('../db');
var Address = require('./Address');
var Account = require('./Account');

var Client = {
    createClient : function(Client,callback){
        var results;
        Account.createAccount(Client.account,(err,res) => {
            if(err){
                callback(err,null);
            }else{
                Address.createAddress(Client.address,(err,addressId)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        console.log(res);

                        var query = "INSERT INTO `client` "+
                        "(`idClient`,`dob`, `firstname`, `lastname`, `phone`,"+
                        " `sexe`, `idAddress`, `idAccount`) "+
                        "VALUES (NULL,?, ?, ?, ?, ?, ?,?);";
                        db.query(query,[Client.dob,Client.firstname,Client.lastname,Client.phone,Client.sexe,addressId,res.id],
                            (err,rows)=>{
                                if(err) callback(err,null);
                                else callback(null,res.token);
                            });
                    }
                });      
            }
        });
        console.log(results);
        
    },
    isUserExist : function(Client,callback){
        db.query("Select * FROM Client where email = ?",[Client.email],callback);
    },
    updatePassword : function(Client,callback){
        console.log("new password = "+Client.pwd);
        console.log("client email = "+Client.email);
        var hashedPass = Account.encryptPassword(Client.pwd);
        console.log("ENCRYPT password = "+hashedPass);
        db.query("update account set pwd = ? where email = ?",[hashedPass,Client.email],callback);
    },/*
    getEmailConfirmationCode : function(Client,callback){
        return db.query("Select * from client where confirmation_token = ?",[Client.confirmation_token],callback);
    },
    setEmailValid : function(Client,callback){
        db.query("update client set status = 0,confirmation_token='' where confirmation_token=?",
            [Client.confirmation_token],
            callback);
    }, */
    login : function(Client,callback){
        db.query("Select * from account,client where account.email = ? && account.idAccount = client.idAccount",
        [Client.email],function(err,fields){
            if(err){
                callback(err,null);
            }else{
                if(fields.length > 0){
                    var pass = Account.decryptPassword(fields[0].pwd);
                    var res = {};
                    if(pass === Client.pwd){
                        res = {
                            status : true,
                            rows : fields
                        }
                    }else{
                        res = {
                            status : false,
                            rows : null
                        }
                    }
                }
                callback(null,res);
            }
        });
    },
    getClient: function(Client,callback){
        db.query("Select * FROM Client,account,Address where client.idAccount= account.idAccount and account.status not in (-1) and client.idAddress=Address.idAddress",[],callback);

    },
    //**************************************** getClientsNbr */
    getClientsNbr: function (callback) {
        db.query("SELECT COUNT(idClient) as 'ClientsNbr' FROM client", callback);
    },
    //**************************************** getClient by id  and it address*/
    getClientByID: function (idClient, callback) {
        db.query("SELECT c.*, ad.* FROM client c, address ad WHERE c.idAddress = ad.idAddress and c.idClient =?",[idClient], callback);
    },
    //******************* get artisans by metier service city */
    getArtisansbyServCity: function (city,idService, callback){
        db.query("SELECT a.* from artisan a, address ad, service_artisant sa where a.idArtisant = sa.idArtisant AND a.idAddress = ad.idAddress and ad.city =?  and sa.idService =?",[city, idService], callback);
    },
    //******************* afficher tt les sartisans par City dans la page d'acceuil*/
    artisansByAddress:function(city,callback){
        console.log(city);
        db.query("select ar.* from artisan ar, address ad where ar.idAddress = ad.idAddress AND ad.city = ?",[city],callback);
    }
}

module.exports = Client;