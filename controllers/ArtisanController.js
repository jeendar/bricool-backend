var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var hbs = require('nodemailer-express-handlebars');
var nodemailer = require('nodemailer');
var path = require('path');
var db = require('../db');

var MailConfig = require('../config/mailer');
var Artisan = require('../models/Artisan');
var base64Img = require('base64-img');



router.use(bodyParser.json());


var mailer = nodemailer.createTransport(MailConfig);

mailer.use('compile', hbs({
    viewPath : 'templates/email/artisan',
    extName : '.hbs'
}));

var sendEmailConfirmation = function(emailAddress,tokenString,callback){
    mailer.sendMail({
                from : 'bricool.gl@gmail.com',
                to: emailAddress, 
                subject: 'Verification de votre compte Bricool', 
                template : 'verificationArtisan',
                context : {
                    token : tokenString
                }
              },callback);
}

router.post('/create',function(req,res){
    //console.log(req.body);
    Artisan.createArtisan(req.body,function(err,token_1){
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


router.post('/userExist',function(req,res){
    Artisan.isUserExist(req.body,function(err,rows){
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
    Artisan.getEmailConfirmationCode(req.body,function(err,rows){
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
    Artisan.setEmailValid(req.body,function(err){
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).send({"message":"Verification effectué par succes"});
        }
    });
});

router.post('/reset-password',function(req,res){

});

router.post('/login',function(req,res){
    Artisan.login(req.body,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

router.post('/art-verified', function(req,res){
    Artisan.artisanVerified(req.body, function(err){
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).send({"message":"artisan verification done!!"});
        }
    });
});

router.get('/findArtisans',function(req,res){
    Artisan.findArtisants(req.body,function(err,rows){
        if(err){
            res.status(400).send(err);
           // res.status(200).send("Aucun Artisant pour ces critères");
        }else{
            res.json(rows);
        }
    });
});


//********************************    */

router.get("/", function (req, res) {
    Artisan.getOneArtisanById(req.query.idArtisant, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            if (result.length > 0) {
                res.send(result[0]);
                console.log(result);
            } else res.status(404).send({"message": "NOT FOUND !"});
        }

    });
});

router.post('/update-infos', function (req, res) {
    Artisan.updateInfos(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({"message": "Modification effectuée par succes"});
        }
    });
});
router.post('/delete-infos', function (req, res) {
    Artisan.deleteInfos(req.body.field, req.body.id, function (err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({"message": "Suppression effectuée par succes"});
        }

    });
});

router.get('/get-nbr-projects', function (req, res) {
    Artisan.getProjectsNbr(req.query.ArtisanId, function (err, result, fields) {
        if (err) res.status(400).send(err);
        else res.status(200).send(result[0]);


    });
});
router.get('/get-feed-backs', function (req, res) {
    Artisan.getFeedBacks(req.query.ArtisanId, function (err, result, fields) {
        if (err) res.status(400).send(err);
        else {
            if (result.length > 0) {
                res.send({"feedbacks": result});
            } else res.status(204).send({"message": "NO COMMENT FOUND !"});
        }
    });
});

router.post('/client-feedback', function (req, res) {
    Artisan.addClientFeedBack(req.query.ArtisanId, req.body, function (err) {
        console.log(req.body);
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({"message": "Feedback successfully added !"});
        }
    });
});

router.put('/client-feedback', function (req, res) {
    Artisan.addArtisanReview(req.query.ArtisanId, req.body.ClientId, req.body.note, function (err) {
        console.log(req.body);
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({"message": "rating successfully Updated !"});
        }
    });
});

router.get('/client-feedback', function (req, res) {
    Artisan.getReviewArtisanByClient(req.query.ArtisanId, req.body.ClientID, function (err, result, fields) {
        if (err) res.status(400).send(err);
        else res.status(200).send(result);
    });
});

/** ********************************/
router.post('/addArtServiceMetier', function (req, res) {
    Artisan.addServiceMetier(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({"message": "Ajout addArtServiceMetier effectuée par succes"});
        }
    });
});

router.get('/getArtServiceMetier', function (req, res) {
    Artisan.getServiceMetier(req.query.idArtisant, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});
/** *************************************/

router.addImageProject = function (path, idProjet, callback) {
    db.query("INSERT INTO image(path,idProjet) VALUES(?,?);", [path, idProjet], callback);
};

router.addProject = function (desc, idArtisan, title, callback) {
    db.query("INSERT INTO projet(description,idArtisan,title) VALUES(?,?,?);", [desc, idArtisan, title], callback);
};

/** get Artisan Projects
 * Author : Zakaria*/
router.get('/artisan-projects', function (req, res) {
    Artisan.getArtisanProjects(req.query.ArtisanId, function (err, result, fields) {
        if (err) res.status(400).send(err);
        else {
            for (let i = 0; i < result.length; i++) {
                var b64Im = base64Img.base64Sync(result[i].path);
                result[i].b64Image = b64Im;
            }
            res.status(200).send(result)
        }
    });
});
module.exports = router;
