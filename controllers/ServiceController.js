var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var path = require('path');

var Service = require('../models/Service');

router.use(bodyParser.json());


router.get('/',function(req,res){
    Service.getServices(function(err,rows){
        if(err){
            res.status(400).send(err);
        }else{
            res.json(rows);
        }
    });
});
router.post("/create",function(req,res){
    Service.createService(req.body,function(err,row){
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
});

//************************ */
router.get("/getServiceByIdMetier",function(req,res){
    Service.getServiceByIdMetier(req.query,function(err,result){
        //console.log(req.query);
        if(err){
            res.status(400).send(err);
        }else{
            res.send(result);
            console.log(result[0]);
            //res.json(result);
        }
    });
});
/**************************************************** */
router.post("/delete",function(req,res){
    Service.deleteService(req.body,function(err,row){
        if(err){
            res.send(err);
        }else{
            res.json(row);
        }
    });
});
module.exports = router;