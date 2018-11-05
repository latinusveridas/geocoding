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

// LOADING OPTIONS IN GEOCODER
var geocoder = NodeGeocoder(Options);

// GEOCODING
function geocodeFunction(userRequest,callback) {

    var splitted = userRequest.split(" ");
    var resNumberHome = splitted[0];

    var result1;

    geocoder.geocode(userRequest, function(err,res) {

        //SHOW RESPONSE
        console.log(res);
    
        // RETURNED RESPONSE IS AN ARRAY WITH ONE JSON OBJECT
        var resArray = res[0];
    
        // SELECT OUR KEYS
        var resStreet = resArray.streetName;
        var resCity = resArray.city;
        var resState = resArray.state;
        console.log(resNumberHome,resStreet, resCity,resState);
    
        // SELECT LATITUDE & LONGITUDE
        var resLatitude = resArray.latitude;
        var resLongitude = resArray.longitude;

        //GENERATE EVENT ID
        var dt = datetime.create();
        var dt = dt.format('Y_m')
        var eventID = dt + "_E_" + rdmString.generate(40)
        console.log("GENERATED EVENT_ID " + eventID) 
    
        //PUT ALL THE STUFF IN A ARRAY
        /*var targetTable = "sampledb.events_location";
        var locationData = [
        "'"+ eventID + "'",
        "'" + resLatitude.toString() + "'",
        "'" + resLongitude.toString() + "'",
        "'" + resState + "'",
        "'" + resCity + "'",
        "'" + resStreet + "'",
        "'" + resNumberHome.toString() + "'"
        ]*/

        var result1 = [
            targetTable,
            eventID,
            resLatitude,
            resLongitude,
            resState,
            resCity,
            resStreet,
            resNumberHome
        ]

        console.log("INSIDE EVENTS : ",result1)

        return callback(result1);
        
    });

};



module.exports.geocodeFunction = geocodeFunction;