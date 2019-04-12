var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var path = require('path');

var Address = require('../models/Address');

router.use(bodyParser.json());


router.get('/',function(req,res){
    Address.getAddress(function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            res.json(rows);
        }
    });
});
/*
router.post("/create",function(req,res){
    Service.createService(req.body,function(err,row){
        if(err){

            res.send(err);
        }else{
           
            res.json(row);
        }
    });
});

router.post("/delete",function(req,res){
    Service.deleteService(req.params.id,function(err,row){
        if(err){
            res.send(err);
        }else{
           
            res.json(row);
        }
    });
});
router.post("/update",function(req,res){
    Service.updateService(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.json(row);
        }
    });
}); */
module.exports = router;