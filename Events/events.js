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

router.get('/innerjoin', function(req,res) {

	//Debug
    	var location = "fr"
    
	DB.CreatePool(location).then(currPool => {
	DB.ConnectToDB(currPool).then(currCon => {
		
		var sql = `SELECT events_${location}.*, users_${location}.first_name, users_${location}.organizer_id, users_${location}.organizer_rating FROM events_${location} INNER JOIN users_${location} ON users_${location}.organizer_id = events_${location}.organizer_id`
		
		DB.GoQuery(currCon,sql).then(resultPost => {
		
		//var packetStr = JSON.stringify(resultPost)
		//var packetStr = JSON.parse(packetStr)
		//console.log(resultPost)
		res.status(200).send(resultPost)

		}) //GoQuery Select
	currCon.release()
	}) // GetConnection

	}) // CreatePool

}) // Appget

// ====================================================== MAIN FUNCTIONS ======================================================
/*
router.get('/all',function(req,res) {

    var targetTable = 'sampledb.events';

    DB.selectall(targetTable, function (callback) {
        res.send(callback)
    })

});*/
/*
router.get('/innerjoin', function(req,res) {

    //var targetQuery = 'SELECT events.*,users.first_name FROM events INNER JOIN users ON users.organizer_id = events.organizer_id'

    var targetQuery = 'SELECT events.*, users.first_name, events_location.latitude, events_location.longitude FROM events INNER JOIN users ON users.organizer_id = events.organizer_id INNER JOIN events_location ON events_location.event_id = events.event_id'

    DB.innerjoin(targetQuery, function (callback) {
        res.send(callback)
    })

});*/


router.post('/createevent', function (req,res) {

 app.get('/createevent', function (req,res) {

	var country_code_table = "fr" // <--- DEBUG

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
    
    //debug
    sport = "sailing"
    organizer_id = "debug_organizer_id2"
    price = 5
    part_max = 10
    date = "2019-11-02"
    addressStr = "24 Rue Rameau Clermont Ferrand"
	
    var colTarget = "event_id,date,sport,nb_part_sub,nb_part_max,price_per_part,organizer_id,latitude,longitude,country,city,street_name,street_number"

    //console.log("Collected from the client:",sport,organizer_id,price,part_max,date,addressStr,location_city)
    
    // Generate the event_id
    var dt = datetime.create();
    var dt = dt.format('Y_m')
    var eventID = dt + '_E_' + rdmString.generate(40) ;
    
    // Geocoding closure to obtain geocoding data which will be saved in the db
    geocodeFunction(addressStr).then(dictGeoResult => {
    		
	var valToInsrt = [
	eventID,
	date,
	sport,
	0, // <-- nb-part-sub = 0
	part_max,
	price,
	organizer_id,
	dictGeoResult.latitude,
	dictGeoResult.longitude,
	dictGeoResult.state,
	dictGeoResult.city,
	dictGeoResult.street,
	dictGeoResult.number
	]
		
	var sql = "INSERT INTO 2019_fr (" + colTarget + ") VALUES (?)"
	var inserts = [valToInsrt];
	sql = mysql.format(sql, inserts);
	
	promiseBasicQuery(sql).then(QueryResult => {
		
		res.status(200).send("OK")
		
	})	//BasicQuery
	

		
		
	}) // geocoding
	
}); // createevent
        
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

	return new Promise(function(resolve,reject) {
	
	//on recupere juste le numero de maison car pb en geocoding
    var splitted = userRequest.split(" ");
    var resNumberHome = splitted[0];

		geocoder.geocode(userRequest, function(err,res) {

			// RETURNED RESPONSE IS AN ARRAY WITH ONE JSON OBJECT
			var resArray = res[0];

			//console.log(resArray)
		
			// SELECT OUR KEYS
			var resStreet = resArray.streetName;
			var resCity = resArray.city;
			var resState = resArray.state;
			//console.log(resNumberHome,resStreet, resCity,resState);
		
			// SELECT LATITUDE & LONGITUDE
			var resLatitude = resArray.latitude;
			var resLongitude = resArray.longitude;

			var locationData = {
				"latitude": resLatitude.toString(),
				"longitude": resLongitude.toString() ,
				"state": resState ,
				"city": resCity,
				"street": resStreet,
				"number": resNumberHome.toString()
			}

			resolve(locationData);
			
		});
	
	}) // Promise

};



module.exports.geocodeFunction = geocodeFunction;
