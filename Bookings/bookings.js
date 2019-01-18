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

router.post('/book', function (req,res) {

	//Debug
	var location = "fr"
	var event_id = ""
	var user_id = ""
	var date_booking = ""
	var still_booked = 1
	
	DB.CreatePool(location).then(currPool => {
	DB.ConnectToDB(currPool).then(currCon => {
		
		var columns = "event_id,user_id,date_booking,still_booked"
		var bas = `INSERT INTO 01_bookings_${location} (${columns}) VALUES (?)`
		var inserts = [event_id,user_id,date_booking,still_booked]
		var sql = mysql.format(bas,inserts)
		
		DB.GoQuery(currCon,sql).then(resultPost => {
		
			if (resultPost.affectedRows == 1) {
			
				var bas = `SELECT still_booked FROM 01_bookings_${location} WHEN event_id = ?`
				var inserts = [event_id]
				var sql = mysql.format(bas,inserts)
				
				DB.GoQuery(currCon,sql).then(rawRes => {
				
				console.log(rawRes)
				res.status(200).send("ok")
				})
				
			} else {
			
			}
		//var packetStr = JSON.stringify(resultPost)
		//var packetStr = JSON.parse(packetStr)
		//console.log(resultPost)
		

		}) //GoQuery Select
	currCon.release()
	}) // GetConnection
	}) // CreatePool

})
