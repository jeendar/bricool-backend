var express = require('express');
var cors = require('cors');
var app = express();

var multer = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');
var DIR = './uploads/';
var upload = multer().single('file')


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Origin, Content-Type, X-Auth-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

app.use(multer({
    storage: storage
}).single('file'));

app.post('/artisan/projects', function (req, res) {
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    upload(req, res, function (err) {
        if (err) {
            return res.end(err.toString());
        }
        console.log(" * FileName : ");
        console.log(req.file.filename);
        console.log(req.file.destination + req.file.filename);
        console.log(req.query.idProject);

        ArtisanController.addImageProject(req.file.destination + req.file.filename, req.query.idProject, function (req, res) {
            console.log(req);
            console.log(res);
        });
        res.end('File is uploaded');

    });
});

app.put('/artisan/projects', function (req, resp) {
    console.log(req.body);
    console.log(req.query);
    ArtisanController.addProject(req.body.project.prDesc, req.query.ArtisanId, req.body.project.prTitle, function (req, res, err) {
        if (err) {
            console.log(err);
            resp.status(500).send({'msg': 'Error Occurred'});
        } else {
            console.log(res.insertId);
            resp.status(200).send({'msg': 'Project successfully inserted'});
        }
    });
});

var ArtisanController = require('./controllers/ArtisanController');
var AccountController = require('./controllers/AccountController');
var MetierController = require('./controllers/MetierController');
var ServiceController = require('./controllers/ServiceController');
var AdminController = require('./controllers/AdminController');
var ClientController = require('./controllers/ClientController');
var AddressController = require('./controllers/AddressController');
var PaymentController = require('./controllers/PaymentController');

app.use(cors());

app.use("/artisan",ArtisanController);
app.use("/account",AccountController);
app.use("/metier",MetierController);
app.use("/service",ServiceController);
app.use("/admin",AdminController);
app.use("/client",ClientController);
app.use("/address",AddressController);
app.use("/payment",PaymentController);

module.exports = app;