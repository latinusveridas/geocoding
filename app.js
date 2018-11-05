
//EXPRESS
var express = require('express');
var app = express();

var Pool = require('./Database/database');
var Geo = require('./Events/events')



app.get('/',function(req,res) {
    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    Geo.geocodeFunction('21 lotissement les peupliers 48100 Marvejols', function (callback) {

        console.log("DEBUG IN APP AFTER CALLBACK. ARRAY IS : ", callback)

        //ON DEFINIE targetTable & locationData
        var targetTable = callback[0]
        var myEvent = callback[1,0]
        var locationData = [
            callback.eventID,
            callback.resLatitude,
            callback.resLongitude,
            callback.resState,
            callback.resCity,
            callback.resStreet,
            callback.resNumberHome
        ]

        console.log(targetTable, myEvent)
        console.dir(locationData)

    });

    //#2 CALL FUNCTION
    //Pool.insertinto(targetTable,locationData);
    

});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
