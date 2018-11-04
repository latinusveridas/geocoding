
//EXPRESS
var express = require('express');
var app = express();

var Pool = require('./Database/database');
var Geo = require('./Events/events')



app.get('/',function(req,res) {
    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    var resGeo = Geo.geocodeFunction('21 lotissement les peupliers 48100 Marvejols');
    console.log("RETURNED DATA IS: " + resGeo);

    //#2 CALL FUNCTION
    Pool.insertinto(targetTable,locationData);
    

});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
