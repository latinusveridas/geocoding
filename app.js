
//EXPRESS
var express = require('express');
var app = express();

var Pool = require('./Database/database');
var Geo = require('./Events/events')



app.get('/',function(req,res) {
    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE
    var clbackGeo

    //#1 GEOCODING
    Geo.geocodeFunction('21 lotissement les peupliers 48100 Marvejols', function(callback) {
        var mod = JSON.stringify(callback)
        console.log("RETURNED DATA IS: " + mod);
        clbackGeo = callback;
    });

    //PARSE targetTable & locationData
    var tt = clbackGeo.eventID
    var ld = [
        clbackGeo.city
    ]

    console.log("ADDED DEBUG", tt,ld)


    //#2 CALL FUNCTION
    //Pool.insertinto(targetTable,locationData);
    

});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
