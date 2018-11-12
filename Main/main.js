var express = require('express');
var router = express.Router();

var Pool = require('../Database/database');
var Geo = require('..events/Events/events');

//TYPEOF
var TypeOf = require('type-of-is');


router.get('/geo', function (req, res) {

    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    Geo.geocodeFunction('21 lotissement les peupliers 48100 Marvejols', function (callback) {

        console.log("DEBUG IN APP AFTER CALLBACK. ARRAY IS : ", callback)

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

        console.log(resTable)
        console.dir(locationData)

        //#2 CALL DATABASE INSERTION
        Pool.insertinto(resTable, locationData);

    });

    res.send('Success !')
});