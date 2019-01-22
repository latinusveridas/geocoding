//DATE & TIME
var datetime = require('node-datetime');

////GEOCODER
var NodeGeocoder = require('node-geocoder');
var Options = {provider: 'openstreetmap'};
var geocoder = NodeGeocoder(Options);

//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DATES
var isoWeek = require('iso-week');
var dateModule = require('date-and-time');

// DB
var mysql = require('mysql');
var DB = require('./Database/database')

//RANDOM STRING
var rdmString = require('randomstring');

// MATH 
var mathjs = require('mathjs');

// UPLOAD
const multer = require('multer');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// UPLOADS 

// Definition of Multer options
// We use define storage options, filefilter function et mode single
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb)
  }
}).single('myImage')

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  // Return value	
  if(mimetype && extname) {return cb(null,true) } else {cb('Error: Images Only!')}
}

// DEFINE POOLING
var pool_events = mysql.createPool({
    connectionLimit: 10,
    host: "83.217.132.102",
    port: '3306',
    user: "root",
    password: "Miroslava326356$$$$$",
    database: "events"
});

//Structure of the response
var resMain = {
    "error": 0,
    "error_description": "",
    "success" : "",
    "type_data" : "",
    "data" : {}
}


app.post('/upload', function (req,res) {

  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });




})





app.get('/debug',function(req,res){

	var location = "fr"
	var event_id = "2019_01_E_6FtMoLT1NtWL45kfnOVW3iIbpjYLmlFIGG6sdA43"

	DB.CreatePool(location).then(currPool => {
	DB.ConnectToDB(currPool).then(currCon => {

		// 1 . Test si booking possible
		var bas = `SELECT nb_part_sub,nb_part_max FROM events_${location} WHERE event_id = ?`
		var inserts = [event_id]
		var sql = mysql.format(bas,inserts)

		DB.GoQuery(currCon,sql).then(rawRes => {

			if (rawRes.nb_part_sub == rawRes.nb_part_max) {
				resMain.error = 1
				resMain.error_description = "event already full"
			} else {

			}


		})
	})
	})

})


app.get('/collectevents', function (req,res) {

	var Code = "fr" // <--- Debug
	CollectEvents(Code).then(toBeSend => {
	res.status(200).json(toBeSend)
	})

});


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

function CollectEvents(countryCode) {

	return new Promise (function(resolve,reject) {

		PrepareAndQuery(countryCode).then(rawResult => {
		resolve(rawResult)
		})
	})

}

function PrepareAndQuery(countryCode) {

	return new Promise(function(resolve,reject) {
	
		var strQuery = "SELECT * from 2019_" + countryCode
		promiseBasicQuery(strQuery).then(rawRows => {
		resolve(rawRows)
		})
	
	})
}
/*
app.get('/book', function (req,res) {

	//Debug
	var location = "fr"
	var event_id = "2019_01_E_6FtMoLT1NtWL45kfnOVW3iIbpjYLmlFIGG6sdA43"
	var user_id = "2019_01_U_quentin"
	var date_booking = "2019-05-17 20:00:00"
	var still_booked = 1
	
	var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    	}
	
	DB.CreatePool(location).then(currPool => {
	DB.ConnectToDB(currPool).then(currCon => {
		
		var columns = "event_id,user_id,date_booking,still_booked"
		var bas = `INSERT INTO 01_bookings_${location} (${columns}) VALUES (?)`
		var inserts = [event_id,user_id,date_booking,still_booked]
		var inserts = [inserts]
		var sql = mysql.format(bas,inserts)
		
		DB.GoQuery(currCon,sql).then(resultPost => {
		
			if (resultPost.affectedRows == 1) {
			
				var bas = `SELECT still_booked FROM 01_bookings_${location} WHERE event_id = ?`
				var inserts = [event_id]
				var sql = mysql.format(bas,inserts)
				
				DB.GoQuery(currCon,sql).then(rawRes => {
				
				var packetStr = JSON.stringify(rawRes)
				var packetStr = JSON.parse(packetStr)
				var onlyBoolean = packetStr.map(curr => curr.still_booked);
				var totalBooked = mathjs.sum(onlyBoolean)
				
				var bas = `UPDATE events_${location} SET nb_part_sub = ? WHERE event_id = ?` 
				var inserts = [totalBooked, event_id]
				var sql = mysql.format(bas,inserts)
				DB.GoQuery(currCon,sql).then(rawRes => {
				
					if (rawRes.affectedRows == 1) {
					resMain.success = 1
					res.status(200).send(resMain)
					} else {
					resMain.error = 1
					res.status(500).send(resMain)
					}
				
				})
				
				
				
				})
				
			} else {
			
			}

		}) //GoQuery Select
	currCon.release()
	}) // GetConnection
	}) // CreatePool

})*/

// ================ SERVER LAUNCH ======================
// Helper on port 3002
app.listen(3002,function(req,res){
    console.log('WORKS DATES ON GOING');
});

// =================== DATABASES FUNCTIONS ==============================

function promiseBasicQuery(query) {

	return new Promise(function(resolve,reject) {
		
		pool_events.getConnection(function (err,con) {
			if (err) {
				console.log(err)
			} else {
				console.log("Check connection : OK")
			con.query(query, function(err,result,fields) {	
					if (err) {
						return reject(err)
						console.log(err)
					} else {
						return resolve(result)
					}

					})
			
			}
			con.release();
		})

	})
}

function checkEventsInTheTable(elem) {

	return new Promise(function(resolve,reject) {
		
	    // PRELIMINARY WORKS
	    var collected_events = [] 
	    var organizer_id = "'debug_organizer_id_1'"
	    
	    var selec_query = "SELECT * FROM " + elem + " WHERE organizer_id = " + organizer_id

	    promiseBasicQuery(selec_query).then(results => {
	    resolve(results)
	    });

	})
				    
}

function AddSimpleQuote(elem) {	

	return ("'" + elem + "'")
}

// GEOCODING
function geocodeFunction(userRequest) {
	
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
