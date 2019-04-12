var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var hbs = require('nodemailer-express-handlebars');
var nodemailer = require('nodemailer');
var path = require('path');

var MailConfig = require('../config/mailer');
var Client = require('../models/Client');



router.use(bodyParser.json());


var mailer = nodemailer.createTransport(MailConfig);

mailer.use('compile', hbs({
    viewPath : 'templates/email/client',
    extName : '.hbs'
}));

var sendEmailConfirmation = function(emailAddress,tokenString,callback){
    mailer.sendMail({
                from : 'bricool.gl@gmail.com',
                to: emailAddress, 
                subject: 'Verification de votre compte Bricool', 
                template : 'verificationClient',
                context : {
                    token : tokenString
                }
              },callback);
}

router.get('/',function(req,res){
    
});

router.post('/create',function(req,res){
    console.log(req.body);
    Client.createClient(req.body,function(err,token_1){
        if(err){
            res.status(400).send(err);
        }else{
            console.log("i m  in else  of cretate method, and before sendemconf\n"+req.body.account.email+"\n"+token_1);
            sendEmailConfirmation(req.body.account.email,token_1,function(){
                if(err){
                    console.log("i m  in err res of sendemconf");
                    res.status(400).send(err);
                }
                console.log("i m  before res . send of sendemconf");
                res.send({status:true});
                console.log("i m  after res . send of sendemconf");
            });
        }
    });
});

router.post('/login',function(req,res){
    Client.login(req.body,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});



router.post('/userExist',function(req,res){
    Client.isUserExist(req.body,function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            console.log(rows[0]);
            if(rows.length > 0){
                res.status(200).send(true);
            }else{
                res.status(200).send(false);
            }
        }
    });
});

router.post('/email-verification-done',function(req,res){
    Client.getEmailConfirmationCode(req.body,function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            if(rows.length > 0){
                res.send({"result":false});
            }else{
                res.send({"result":true});
            }
        }
    });
});


router.post('/email-verification',function(req,res){
    Client.setEmailValid(req.body,function(err){
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).send({"message":"Verification effectuée par succes"});
        }
    });
});

router.post('/reset-password',function(req,res){
    console.log(req.body);
    Client.updatePassword(req.body, function(err){
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).send({"message":"update pass succeded!!"});
        }
    });
});

//******************* get artisans by metier service city */
router.get('/getArtisansbyServCity', function (req, res) {
    console.log("req.query"+req.query);
    Client.getArtisansbyServCity(req.query.city, req.query.idService, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

//******************* Afficher tt les artisans par City dans la page d'acceuil */
router.get('/artisanByAddress',function(req,res){
    console.log(req.query);
    Client.artisansByAddress(req.query.city,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

//******************* getClient by id  and it address */
router.get('/getClientByID',function(req,res){
    console.log(req.query);
    Client.getClientByID(req.query.idClient,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
