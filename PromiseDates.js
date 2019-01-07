//
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

// DEFINE POOLING
var pool_events = mysql.createPool({
    connectionLimit: 10,
    host: "83.217.132.102",
    port: '3306',
    user: "root",
    password: "Miroslava326356$$$$$",
    database: "events"
});

module.exports.pool_events = pool_events;

var resMain = {
    "error": 0,
    "error_description": "",
    "success" : "",
    "type_data" : "",
    "data" : {}
}


// ====================================================

app.get('/dates2', function (req,res) {
	
	var CollectedOrganizedEvents = []

	// 1. We collect the name of the tables of the db event through the function collectTablesInEventsDB
	collectTablesInEventsDB().then(collection_tables => {
		console.log("Principal log, result is : ",collection_tables)

		for (let i = 0; i < collection_tables.length; i++) {
		//On teste chaque element i
		
		// 2. On teste si la table doit etre teste
		tableShouldBeTested(collection_tables[i]).then( ShouldBeTested => {
		// if result is true, we screen the table
			
			if (ShouldBeTested == true) {
				
				// 3. On recupere les lignes de la tables
				checkEventsInTheTable(collection_tables[i]).then( obtainedRowResults => {
				console.log(obtainedRowResults)
				CollectedOrganizedEvents.push(obtainedRowResults)
				console.log("State of collected events", CollectedOrganizedEvents)
					console.log("i = ", i)
					console.log("collenction lenght", collection_tables)
					if ( i == collection_tables.length ) {
						res.status(200).json(CollectedOrganizedEvents)
					} else {
						
					}
				})
				
			} else {
			// Do nothing
			}
				
			})
				
		}

	})
})

// ================ SERVER LAUNCH ======================
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('WORKS DATES ON GOING');
});

// ================ HELPERS ==========================


// =================== DATABASES FUNCTIONS ==============================

function promiseBasicQuery(query) {
	return new Promise(function(resolve,reject) {
		
		pool_events.getConnection(function (err,con) {
			
			if (err) {
				console.log(err)
			} else {
				console.log("Success to retrieve the connection")
			con.query(query, function(err,result,fields) {	
					if (err) {
						return reject(err)
						console.log(err)
					} else {
						console.log("log: promiseBasicQuery # of RowDataPacket sent: ", result.length)
						return resolve(result)
					}

					})
			
			}
			con.release();
		})

	})
}

function collectTablesInEventsDB() {

	return new Promise(function(resolve,reject) {


	    // PRELIMINARY WORKS
	    var collected_events = [] 
	    var organizer_id = "'debug_organizer_id_1'"

	    // Obtain current year
	    let now = new Date();
	    var curr_year = dateModule.format(now, 'YYYY');
	    console.log("Current Year is ", curr_year)

	    // Obtain current week
	    var curr_week = isoWeek();
	    curr_week = 3 // DEBUG <-------------------------------------------
	    console.log("Current week is ", curr_week)

	    // Collect tables in events db
	    var coll_tables = 'SHOW TABLES'
	    var collection_tables = []

	    promiseBasicQuery(coll_tables).then(results => {
	    collection_tables = results.map(v => v.Tables_in_events);
	    return resolve(collection_tables)
	    });

	})
				    

}

function tableShouldBeTested(i) {
	
	return new Promise (function (resolve,reject) {
	
		var ToBeTested = false	

		// Obtain current year
		let now = new Date();
		var curr_year = dateModule.format(now, 'YYYY');
		console.log("Current Year is ", curr_year)

		// Obtain current week
		var curr_week = isoWeek();
		curr_week = 3 // DEBUG <-------------------------------------------
		console.log("Current week is ", curr_week)

		// Split text du table pour obtenir Year et Week
		var tabl_year = i.substring(0,4);
		console.log("item ", i, tabl_year)
		var tabl_week = i.substring(6,8);
		console.log("item ", i, tabl_week)

		// On loop dans les annees
		if (parseInt(tabl_year) < curr_year) {
		ToBeTested = true
		return resolve(ToBeTested) 
		} else {

			if (parseInt(tabl_year) == curr_year) {
				// Deux cas de figure

				if (parseInt(tabl_week) < curr_week) {
				ToBeTested = true
				return resolve(ToBeTested)
				} else {
					if (parseInt(tabl_week) == curr_week) {
					ToBeTested = true
					return resolve(ToBeTested)
					} else {
					return resolve(ToBeTested)
					}
				}
			} else {
			return resolve(ToBeTested)
			}
		}
		
	})
	
}

function checkEventsInTheTable(elem) {

	return new Promise(function(resolve,reject) {
		
	    // PRELIMINARY WORKS
	    var collected_events = [] 
	    var organizer_id = "'debug_organizer_id_1'"
	    
	    var selec_query = "SELECT * FROM " + elem + " WHERE organizer_id = " + organizer_id

	    promiseBasicQuery(selec_query).then(results => {
	    return resolve(results)
	    });

	})
				    

}
