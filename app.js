
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
        clbackGeo = JSON.stringify(callback);
    });

    //PARSE targetTable & locationData
    console.log("11-05: ", clbackGeo);
    var st = JSON.stringify(clbackGeo);
    console.log("11-05: ", st);
    var myJson = JSON.parse(st);



    //#2 CALL FUNCTION
    //Pool.insertinto(targetTable,locationData);
    

});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
