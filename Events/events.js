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

// BODYPARSE
var bodyParser = require('body-parser')

// ROUTER
var express = require('express');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// COMPONENTS
var DB = require('../Database/database');
var Geo = require('../Events/events');

//====DEBUG MODULES
//TYPEOF
var TypeOf = require('type-of-is');
//====DEBUG MODULES


// ========================================== NEW ========================================













// ====================================================== MAIN FUNCTIONS ======================================================

router.get('/all',function(req,res) {

    var targetTable = 'sampledb.events';

    DB.selectall(targetTable, function (callback) {
        res.send(callback)
    })

});

router.get('/innerjoin', function(req,res) {

    //var targetQuery = 'SELECT events.*,users.first_name FROM events INNER JOIN users ON users.organizer_id = events.organizer_id'

    var targetQuery = 'SELECT events.*, users.first_name, events_location.latitude, events_location.longitude FROM events INNER JOIN users ON users.organizer_id = events.organizer_id INNER JOIN events_location ON events_location.event_id = events.event_id'

    DB.innerjoin(targetQuery, function (callback) {
        res.send(callback)
    })

});


router.post('/createevent', function (req,res) {

        var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }
    
    // Define the variables    
    var sport = req.body.sport
    var organizer_id = req.body.organizer_id
    var price = req.body.price
    var part_max = req.body.part_max
    var date = req.body.date
    var addressStr = req.body.address_string
    var location_city = "" // Will be feeded during geocoding and sent to events table

    console.log(sport,organizer_id,price,part_max,date,addressStr,location_city)
    
    // Generate the event_id
    var dt = datetime.create();
    var dt = dt.format('Y_m')
    var eventID = dt + '_E_' + rdmString.generate(40) ;
    //console.log("GENERATED EVENT_ID " + eventID) 
    
    // Define boolean value to assess the success of each query
    var isSuccessTableEvents = false
    var isSuccessTableLocation = false

    // Geocoding closure to obtain geocoding data which will be saved in the db
    geocodeFunction(addressStr, function (callback) {

        //ON DEFINIE targetTable & locationData
        var resTable = callback[0]
        var locationData = [
            // on geocodeFunction, the eventID is put as nil, so now its loaded is the values loaded is the db
            "'" + eventID + "'",
            "'" + callback[1][1] + "'",
            "'" + callback[1][2] + "'",
            "'" + callback[1][3] + "'",
            "'" + callback[1][4] + "'",
            "'" + callback[1][5] + "'",
            "'" + callback[1][6] + "'",
        ]

        //On sauve la data location dans la table events_location
        //var resTable = "events_location"
        DB.insertinto(resTable, locationData, function (callback) {

            if (callback.affectedRows = 1) {
            isSuccessTableLocation = true
            } else {
            isSuccessTableLocation = false
            }
            
        console.log("Success posting of location data : ", isSuccessTableLocation)
            
                // Populate location_city for events table
                var location_city = locationData[4]
                console.log("Location city is ",location_city)

                // updating data in events table
                var targetTable = 'sampledb.events'
                var eventData = [
                "'" + eventID + "'",
                "'" + date + "'",
                location_city,
                "'" + sport + "'",
                "'" + 0 + "'",
                "'" + part_max + "'",
                "'" + price + "'",
                "'" + organizer_id + "'",
                ]

                var events_col = [
                    'event_id',
                    'date',
                    'location',
                    'sport',
                    'nb_part_sub',
                    'nb_part_max',
                    'price_per_part',
                    'organizer_id'
                ]

                //On sauve la data events dans la table events
                DB.insertSpecific(targetTable, events_col, eventData, function (callback2) {
            
                    if (callback2.affectedRows = 1) {
                    isSuccessTableEvents = true
                    } else {
                    isSuccessTableEvents = false
                    }

                    console.log("Success posting of events data : ", isSuccessTableEvents)
                
                    // Verification des success et renvoie de la reponse
                    if (isSuccessTableLocation == true && isSuccessTableEvents == true) {
                        resMain.success = 1
                    res.status(200).json(resMain)
                    } else {
                        resMain.error = 1
                        resMain.error_description = "posting failed"
                    res.status(500).json(resMain)
                    }



                }); // Fin de DB.insertinto
                                


        }); // fin de DB.insertinto table_location
    
        
    }); // fin de geocodeFunction
        
}); ////// fin de createevent



router.post('/geo', function (req, res) {

    var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }

    console.log(req.body.address)

    //THIS IS THE FUNCTION THAT TRANSLATE THE REQ BODY TO A GEOCODED DATA,AND FILL IT THE DATABASE

    //#1 GEOCODING
    geocodeFunction(req.body.address, function (callback) {

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
        DB.insertinto(resTable, locationData, function(callback) {

            resMain.success = 1
            resMain.data = callback
            res.json(resMain)
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

        console.log(resArray)
    
        // SELECT OUR KEYS
        var resStreet = resArray.streetName;
        var resCity = resArray.city;
        var resState = resArray.state;
        //console.log(resNumberHome,resStreet, resCity,resState);
    
        // SELECT LATITUDE & LONGITUDE
        var resLatitude = resArray.latitude;
        var resLongitude = resArray.longitude;

        //GENERATE EVENT ID
        //var dt = datetime.create();
        //var dt = dt.format('Y_m')
        //var eventID = dt + '_E_' + rdmString.generate(40) ;
        //console.log("GENERATED EVENT_ID " + eventID) 
        var eventID = ""
    
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

        console.log("INSIDE EVENTS :", result1)

        return callback(result1);
        
    });

};



module.exports.geocodeFunction = geocodeFunction;
