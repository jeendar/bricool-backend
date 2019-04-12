var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var path = require('path');

var Payment = require("../models/Payment");

router.use(bodyParser.json());

router.get("/",function(req,res){
    Payment.getUnValidatePayment(function(err,result){
        if(err)
            res.status(400).send(err);
        else
            res.send(result);
    })
});

router.post('/create',function(req,res){
    console.log(req);
    Payment.createPayment(req.body,function(err,result){
        if(err)
            res.status(400).send(err);
        else
            res.send({result : "Payment Enrgistrer avec succes"});
    });
});

router.post('/validate',function(req,res){
    Payment.validatePayment(req.body,function(err,result){
        if(err)
            res.status(400).send(err);
        else
            res.send({result : "Payment Effectuer avec succes"});
    });
});

router.get('/all',function(req,res){
    Payment.getPayments(function(err,result){
        if(err)
            res.status(400).send();
        else
            res.send(result);
    });
});

router.get('/artisan',function(req,res){
    Payment.getArtisanPayments(req.query,function(err,rows){
        if(err)
            res.status(400).send();
        else
            res.send(rows);
    });
});

router.get('/details',function(req,res){
    Payment.getPaymentDetails(req.query,function(err,rows){
        if(err)
            res.status(400).send();
        else{
            res.send(rows[0]);
        }
    });
})
module.exports = router;