var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var path = require('path');

var Metier = require('../models/Metier');

router.use(bodyParser.json());


router.get('/',function(req,res){
    Metier.getMetiers(function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            res.json(rows);
        }
    });
});
router.post("/create",function(req,res){
    Metier.createMetier(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.json(row);
        }
    });
});

router.post("/update",function(req,res){
    Metier.updateMetier(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.json(row);
        }
    });
});

////////////////////////////////////////////////////
router.post("/delete",function(req,res){
    Metier.deleteMetier(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.json(row);
        }
    });
});

module.exports = router;
