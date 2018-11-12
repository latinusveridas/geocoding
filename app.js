
//EXPRESS
var express = require('express');
var app = express();

var events = require('./Events/events');
app.use('/events', events);




//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
