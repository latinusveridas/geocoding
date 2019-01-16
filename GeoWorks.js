//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// VARIABLES
var mathjs = require('mathjs');



//=====SERVER LAUNCH========
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('GEO WORKS ON GOING');
});
