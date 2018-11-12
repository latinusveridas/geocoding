
//EXPRESS
var express = require('express');
var app = express();

var main = require('./Main/main');
app.use('/main', main);




//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
