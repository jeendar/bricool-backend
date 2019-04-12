var db = require('../db');
var config = require('../config/config');
var CryptoJS = require('crypto-js');

var encryptPassword = function(pwd){
    return CryptoJS.AES.encrypt(pwd, config.PasswordSecret).toString();
}


var generateConfirmationToken = function(email){
    return CryptoJS.SHA1(email).toString();
}


var generateResetPasswordToken = function(email){
    return CryptoJS.MD5(email).toString();
}


var getCurrentDate = function(){
    //DataBase Format : 
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    return formatted;
}

var Account = {
    createAccount : function(Account,callback){
        var hashedPass = encryptPassword(Account.pwd);
        var confirmation_token = generateConfirmationToken(Account.email);
        var curentDate = getCurrentDate();
        
        var query = "INSERT INTO account " + 
            "(`idAccount`, `confirmation_token`, `created_date`, `email`, `pwd`, `resetpwd_token`, `status`, `verified`)"+ 
            "VALUES (NULL, ?, ?, ?, ?, NULL, '-1', '0');";
        db.query(query,[confirmation_token,curentDate,Account.email,hashedPass],function(err,row){
            if(err){
                callback(err,null);
            }else{
                var result = {
                    id : row.insertId,
                    token : confirmation_token
                }
                callback(null,result);
            }
        });
    },
    confirmAccount : function(Account,callback){
        db.query("SELECT idAccount from account where confirmation_token = ?",[Account.confirmation_token],function(err,fields){
            if(err){
                callback(err,null);
            }else{
                if(fields.length>0){
                    db.query("update account set status = 1, confirmation_token = '' where confirmation_token = ?",
                    [Account.confirmation_token],(err,rows)=>{
                        if(err) callback(err,null);
                        else callback(null,{ status : true });
                    });
                }else{
                    callback(null,{ status : false });
                    // req sur account and artisan
                }
            }
        });
    },
    validateAccount : function(Account,callback){
        //console.log("Account.id");
        //console.log(Account.idAccount);
        db.query("update account set status = 1 where idAccount = ?",[Account.idAccount],callback);
    },

    invalidateAccount : function(Account,callback){
        db.query("update account set status = 0 where idAccount = ?",[Account.idAccount],callback);
    },
    decryptPassword : function(pwd){
        var bytes = CryptoJS.AES.decrypt(pwd,config.PasswordSecret);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

module.exports = Account;