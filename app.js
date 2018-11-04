
//EXPRESS
var express = require('express');
var app = express();

var Pool = require('./Database/database');

//GEOCODER
var NodeGeocoder = require('node-geocoder');

// GEOCODER - OPTIONS
var Options = {
    provider: 'openstreetmap'
};

// LOADING OPTIONS IN GEOCODER
var geocoder = NodeGeocoder(Options);

app.get('/',function(req,res) {

    Pool.pool.getConnection(function(err,con){
        if (err) {
            console.log(err)
        } else {
            console.log('Success on connection to the database')
        }

    });

    //===========DEBUG PARSE USER REQUEST
    var userRequest = '21 lotissement les peupliers marvejols';
    var splitted = userRequest.split(" ");
    var resNumberHome = splitted[0];
    //===========DEBUG PARSE USER REQUEST

    geocoder.geocode(userRequest, function(err,res) {

        //SHOW RESPONSE
        console.log(res);

        // RETURNED RESPONSE IS AN ARRAY WITH ONE JSON OBJECT
        var resArray = res[0];

        // SELECT OUR KEYS
        var resStreet = resArray.streetName
        var resCity = resArray.city
        var resState = resArray.state
        console.log(resNumberHome,resStreet, resCity,resState);

        // SELECT LATITUDE & LONGITUDE
        var resLatitue = resArray.latitude;
        var resLongitude = resArray.longitude;

    });


});


//=====SERVER LAUNCH========
app.listen(3000,function(req,res){
    console.log('SERVER ON GOING');
});
