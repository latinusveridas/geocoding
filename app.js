
//EXPRESS
var express = require('express');
var app = express();

var events = require('./Events/events');
app.use('/events', events);

var users = require('./Users/users');
app.use('/users', users);

var authentification = require('./Authentification/authentification');
app.use('/auth', authentification);

app.use(express.static('Public'));


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
