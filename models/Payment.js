var db = require('../db');


var Payment = {
    createPayment : function(Payment,callback){
        console.log(Payment);
        var datePai = Payment.receivedTime.replace('T',' ');
        datePai = datePai.replace('Z','');
        var query = "INSERT INTO `paiements` (`id`, `idArtisan`, `orderID_receive`, `payerID`, `payerName`, `payerEmail`"+
        ", `payerPhone`, `receivedTime`, `receivedAmount`, `payment_status`, `sendTime`, `orderID_send`) "+
        "VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, '0', NULL, NULL);";
        db.query(query,[Payment.idArtisan,Payment.orderID,Payment.payerID,Payment.payerName,Payment.payerEmail
                    ,Payment.payerPhone,datePai,Payment.receivedAmount],function(err,res){
            if(err){
                callback(err,null)
            }else{
                callback(null,res);
            }
        });
    },
    validatePayment : function(Payment,callback){
        db.query("update paiements set payment_status=1 where id = ?",
            [Payment.id],callback);
    },
    getPayments : function(callback){
        return db.query('select * from paiements',callback);
    },
    getUnValidatePayment : function(callback){
        return db.query('select * from paiements where payment_status = 0',callback);
    },
    getPaymentDetails : function(Payment,callback){
        console.log(Payment);
        return db.query('select * from paiements as p,artisan as a where a.idArtisant = p.idArtisan and p.id = ?',[Payment.id],callback);
    },
    getArtisanPayments : function(Payment,callback){
        return db.query('select * from paiements where idArtisan = ?',[Payment.idArtisan],callback);
    }


}

module.exports = Payment