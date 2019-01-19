
//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");

// EVENTS
var events = require('./Events/events');
app.use('/events', events);

//USERS
var users = require('./Users/users');
app.use('/users', users);

//AUTHENTIFICATION
var authentification = require('./Authentification/authentification');
app.use('/auth', authentification);

//PUBLIC PICTURES
app.use(express.static('Public'));

//BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//BOOKINGS
var bookings = require('./Bookings/bookings')
app.use('/bookings', bookings)

//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
