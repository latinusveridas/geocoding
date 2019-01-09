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


app.get('/dates', function (req, res) {
	
	 CollOrganizedEvent().then ( result => {
	 res.status(200).json(result)
	 })
	
});


function CollOrganizedEvent() { // Main function 
	
	var organizer_id = "'debug_organizer_id_1'"

	return new Promise ( function (resolve, reject) {
	
		collectTablesInEventsDB().then( collectedTablesArray => {

			var filteredCollectionTables = FilterCollectedTables(collectedTablesArray)

			var actionOnTable = filteredCollectionTables.map(QueryTable)
			var resultsOfCollect = Promise.all(actionOnTable)

			resultsOfCollect.then( arrCollectedEvents => {
			var cleanedListEvents = UniqueMapping(arrCollectedEvents)
			resolve (cleanedListEvents)
			})

		})

	}) // end of promise

} // end of function

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

	    // Collect tables in events db
	    var coll_tables = 'SHOW TABLES'
	    var collection_tables = []

	    promiseBasicQuery(coll_tables).then(results => {
	    collection_tables = results.map(v => v.Tables_in_events);
	    return resolve(collection_tables)
	    });

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

function UniqueMapping(basicArray) {
	
	var finalCollection = []
	
	basicArray.forEach ( elem => {
		
		if (typeof elem === 'undefined') {
			return
		} else {
			
			var sub_elements_length = elem.length
			console.log("sub elements of basicArray length is ", sub_elements_length)
			
			elem.forEach( subElem => {
				
				finalCollection.push(subElem)
				
			})
			
		}
		
		
	})
	
	return finalCollection
		
}

function FilterCollectedTables(arr){

	var filteredArray = []
	
	// Obtain current year
	let now = new Date();
	var curr_year = dateModule.format(now, 'YYYY');
	//console.log("Current Year is ", curr_year)

	// Obtain current week
	var curr_week = isoWeek();
	curr_week = 3 // DEBUG <-------------------------------------------
	//console.log("Current week is ", curr_week)
	
	arr.forEach ( elem => {

	// Split text du table pour obtenir Year et Week
	var tabl_year = elem.substring(0,4);
	//console.log("item ", elem, tabl_year)
	var tabl_week = elem.substring(6,8);
	//console.log("item ", elem, tabl_week)
		
	switch (true) {
			
		case (parseInt(tabl_year) < curr_year):
			filteredArray.push(elem);
			break;
		case (parseInt(tabl_year) == curr_year):
			
			switch (true) {
			
				case (parseInt(tabl_week) < curr_week):
					filteredArray.push(elem);
					break;
				case (parseInt(tabl_week) == curr_week):
					filteredArray.push(elem);
					break;	
				default:
					
			} // sub switch 
			
		default:
			
	} // switch
		
	}) // arr.forEach
	
	return filteredArray
}

function QueryTable(elem,organizer_id) {

	return new Promise(function(resolve,reject) {
		
	    // PRELIMINARY WORKS
	    var collected_events = [] 
	    //var organizer_id = "'debug_organizer_id_1'"
	    
	    var selec_query = "SELECT * FROM " + elem + " WHERE organizer_id = " + organizer_id

	    promiseBasicQuery(selec_query).then(results => {
	    resolve(results)
	    });

	})				    
}
