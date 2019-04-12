var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Artisan = require('../models/Artisan');
var Client = require('../models/Client');
var Metier = require('../models/Metier');
var Service = require('../models/Service');


router.use(bodyParser.json());

router.get("/artisan-list",function(req,res){
    Artisan.getArtisan(req.query,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
            //console.log(result);
            //res.json(result);
        }
    });
});

router.get("/artisan-profil",function(req,res){
    Artisan.getOneArtisan(req.query,function(err,result){
        console.log(req.query);
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result[0]);
        }
    });
});

router.get("/client-list",function(req,res){
    Client.getClient(req.query,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

router.post("/getArtisanInserted", function (req, res) {
    Artisan.getArtisanInserted(req.body,function(err,rows){
        console.log(req.body);
        if(err) {           
            res.status(400).json(err);
        }
        else
        {
            res.send(rows);
        }
    });
}); 

router.get("/metiers",function(req,res){
    Metier.getMetiers(function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(rows);
        }
    });
});

router.get("/metierExist",function(req,res){
    Metier.metierExist(req.query,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

router.get("/services",function(req,res){
    Service.getServices(function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(rows);
        }
    });
});

router.get("/serviceExist",function(req,res){
    Service.serviceExist(req.query,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

/*Proumouvoir un artisan à un artisan réferent (By Med Soussi le 23/02/2019)*/
router.post("/promote",function(req,res){
    Artisan.promoteArtisan(req.body,(err,result)=>{
        
        if(err){
            res.status(400).send(err);
        }else{
            res.send({status : true});
        }
    });
});

/*Rétrograder un artisan réferent à un artisan ordinaire (By Med Soussi le 23/02/2019)*/
router.post("/demote",function(req,res){
    Artisan.demoteArtisan(req.body,(err,result)=>{
        
        if(err){
            res.status(400).send(err);
        }else{
            res.send({status : true});
        }
    });
});

router.get("/nbrArtisans",function(req,res){
    Artisan.getArtisansNbr((err,result)=>{
        
        if(err){
            res.status(400).send(err);
        }else{
            res.json(result);
        }
    });
});

router.get("/nbrClients",function(req,res){
    Client.getClientsNbr((err,result)=>{
        
        if(err){
            res.status(400).send(err);
        }else{
            res.json(result);
        }
    });
});

module.exports = router;