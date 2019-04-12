var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Account = require('../models/Account');




router.use(bodyParser.json());

router.post("/",function(req,res){
    Account.createAccount(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.send(row.insertId);
        }
    });
});

router.post("/confirm",function(req,res){
    Account.confirmAccount(req.body,function(err,result){
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
        }
    });
});

router.post("/validate",function(req,res){
    Account.validateAccount(req.body,(err,result)=>{
        //console.log("this is my obj");
        //console.log(req.body);
        if(err){
            res.status(400).send(err);
        }else{
            res.send({status : true});
        }
    });
});

router.post("/invalidate",function(req,res){
    Account.invalidateAccount(req.query,(err,result)=>{
        if(err){
            res.status(400).send(err);
        }else{
            res.send({status : true});
        }
    });
});

module.exports = router;