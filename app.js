
//EXPRESS
var express = require('express');
var app = express();

var Pool = require('./Database/database');
var Geo = require('./Events/events')



app.get('/',function(req,res) {
    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    Geo.geocodeFunction('21 lotissement les peupliers 48100 Marvejols', function (callback) {

        //ON STRINGIFY PUIS ON PARSE LE CALLBACK
        var str = JSON.stringify(callback)
        var cbParsed = JSON.parse(str)

        //ON DEFINIE targetTable & locationData
        var targetTable = cbParsed.targetTable
        var locationData = [
            cbParsed.eventID,
            cbParsed.resLatitude,
            cbParsed.resLongitude,
            cbParsed.resState,
            cbParsed.resCity,
            cbParsed.resStreet,
            cbParsed.resNumberHome
        ]

    });

    //#2 CALL FUNCTION
    Pool.insertinto(targetTable,locationData);
    

});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
