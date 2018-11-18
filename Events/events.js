// ====================================================== MODULES & VARIABLES ======================================================

//GEOCODER
var NodeGeocoder = require('node-geocoder');

//RANDOM STRING
var rdmString = require('randomstring');

//DATE & TIME
var datetime = require('node-datetime');

// GEOCODER - OPTIONS
var Options = {
    provider: 'openstreetmap'
    };
var geocoder = NodeGeocoder(Options);

// ROUTER
var express = require('express');
var router = express.Router();

// COMPONENTS
var Pool = require('../Database/database');
var Geo = require('../Events/events');

//====DEBUG MODULES
//TYPEOF
var TypeOf = require('type-of-is');
//====DEBUG MODULES

// ====================================================== MAIN FUNCTIONS ======================================================

router.get('/all',function(req,res)
{

    var targetTable = 'sampledb.events';

    Pool.selectall(targetTable, function (callback) {
        res.send(callback)
    })

});

router.get('/geo', function (req, res) {

    console.log(req.body.email)

    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    geocodeFunction('21 lotissement les peupliers 48100 Marvejols', function (callback) {

       // console.log("DEBUG IN APP AFTER CALLBACK. ARRAY IS : ", callback)

        //ON DEFINIE targetTable & locationData
        var resTable = callback[0]
        var locationData = [
            "'" + callback[1][0] + "'",
            "'" + callback[1][1] + "'",
            "'" + callback[1][2] + "'",
            "'" + callback[1][3] + "'",
            "'" + callback[1][4] + "'",
            "'" + callback[1][5] + "'",
            "'" + callback[1][6] + "'",
        ]

        //console.log(resTable)
        //console.dir(locationData)

        //#2 CALL DATABASE INSERTION
        Pool.insertinto(resTable, locationData, function(callback) {
            res.send(callback)
        });


    });


});


module.exports = router;


// ======================================================SUB FUNCTIONS======================================================

// GEOCODING
function geocodeFunction(userRequest,callback) {

    var splitted = userRequest.split(" ");
    var resNumberHome = splitted[0];

    var result1;

    geocoder.geocode(userRequest, function(err,res) {

        //SHOW RESPONSE
        //console.log(res);
    
        // RETURNED RESPONSE IS AN ARRAY WITH ONE JSON OBJECT
        var resArray = res[0];
    
        // SELECT OUR KEYS
        var resStreet = resArray.streetName;
        var resCity = resArray.city;
        var resState = resArray.state;
        //console.log(resNumberHome,resStreet, resCity,resState);
    
        // SELECT LATITUDE & LONGITUDE
        var resLatitude = resArray.latitude;
        var resLongitude = resArray.longitude;

        //GENERATE EVENT ID
        var dt = datetime.create();
        var dt = dt.format('Y_m')
        var eventID = dt + '_E_' + rdmString.generate(40) ;
        console.log("GENERATED EVENT_ID " + eventID) 
    
        //PUT ALL THE STUFF IN A ARRAY
        var targetTable = 'sampledb.events_location';

        var locationData = [
            eventID,
            resLatitude.toString(),
            resLongitude.toString() ,
            resState ,
            resCity,
            resStreet,
            resNumberHome.toString()
        ];

        var result1 = [
            targetTable,
            locationData
        ]

        //console.log("INSIDE EVENTS : ",result1)

        return callback(result1);
        
    });

};



module.exports.geocodeFunction = geocodeFunction;