// ====================================================== MODULES & VARIABLES ======================================================

//RANDOM STRING
var rdmString = require('randomstring');

//DATE & TIME
var datetime = require('node-datetime');

// BODYPARSE
var bodyParser = require('body-parser')

// ROUTER
var express = require('express');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// COMPONENTS
var DB = require('../Database/database');

var mysql = require('mysql')

// ================================================================================================================================

router.get('/listbooking', function(req,res) {

	//Debug
	var location = "fr"
    
	DB.CreatePool(location).then(currPool => {
	DB.ConnectToDB(currPool).then(currCon => {

		var bas = `SELECT * FROM 01_bookings_${location} WHERE event_id = ?`
		var inserts = [event_id]
		var sql = mysql.format(bas,inserts)
		
		DB.GoQuery(currCon,sql).then(resultPost => {
		
		//var packetStr = JSON.stringify(resultPost)
		//var packetStr = JSON.parse(packetStr)
		//console.log(resultPost)
		res.status(200).send(resultPost)

		}) //GoQuery Select
	currCon.release()
	}) // GetConnection
	}) // CreatePool
}) // Router listbooking


router.post('/book', function (req,res) { // <-- TO BE MOVED TO POST

	//Debug
	var location = "fr"
	//var event_id = "2019_01_E_6FtMoLT1NtWL45kfnOVW3iIbpjYLmlFIGG6sdA43"
	//var user_id = "2019_01_U_quentin"
	//var date_booking = "2019-05-17 20:00:00"
	//var still_booked = 1

	var event_id = req.body.event_id
	var user_id  = req.body.user_id
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

		// 1 . Test si booking possible
		var bas = `SELECT nb_part_sub,nb_part_max FROM events_${location} WHERE event_id = ?`
		var inserts = [event_id]
		var sql = mysql.format(bas,inserts)

		DB.GoQuery(currCon,sql).then(rawRes => {
			console.log(rawRes)
			rawRes = JSON.stringify(rawRes)
			rawRes = JSON.parse(rawRes)
			console.log(rawRes)
			console.log("nb_part_sub", rawRes.nb_part_sub)
			console.log("nb_part_max",rawRes["nb_part_max"])

			if (rawRes["nb_part_sub"] == rawRes["nb_part_max"]) {
				resMain.error = 1
				resMain.error_description = "event already full"
				res.status(200).send(resMain)
			} else {
					// 2. Insertion table MONTH_bookings_LOCATION
					var columns = "event_id,user_id,date_booking,still_booked"
					var bas = `INSERT INTO 01_bookings_${location} (${columns}) VALUES (?)`
					var inserts = [event_id,user_id,date_booking,still_booked]
					var inserts = [inserts]
					var sql = mysql.format(bas,inserts)
					
					DB.GoQuery(currCon,sql).then(resultPost => {
					
						if (resultPost.affectedRows == 1) {
						
							// 3. Recalcul nombre bookings
							var bas = `SELECT still_booked FROM 01_bookings_${location} WHERE event_id = ?`
							var inserts = [event_id]
							var sql = mysql.format(bas,inserts)
							
							DB.GoQuery(currCon,sql).then(rawRes => {
							
							// 4. UPDATE Table events_LOCATION
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
								
								}) // Update events_LOCATION

							}) // Recalc nb bookings
							
						} else {
						// PB lors de linsertion dans MONTH_bookings_LOCATION

						}

					}) //GoQuery Select


			} // else booking possible


		}) // Query Booking possible

		
	currCon.release()
	}) // GetConnection
	}) // CreatePool

})

module.exports = router;