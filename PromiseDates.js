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


app.get('/dates3', function (req, res) {

	
	 CollOrganizedEvent()
	
	

});


function CollOrganizedEvent() {

	return new Promise ( function (resolve, reject) {
	
	collectTablesInEventsDB().then( collectedTablesArray => {
	console.log(FilterCollectedTables(collectedTablesArray))
	
	})
	
	
	
	
	}) // end of promise


} // end of function

function FilterCollectedTables(arr){

	var filteredArray = []
	
	// Obtain current year
	let now = new Date();
	var curr_year = dateModule.format(now, 'YYYY');
	console.log("Current Year is ", curr_year)

	// Obtain current week
	var curr_week = isoWeek();
	curr_week = 3 // DEBUG <-------------------------------------------
	console.log("Current week is ", curr_week)
	
	arr.forEach ( elem => {

	// Split text du table pour obtenir Year et Week
	var tabl_year = elem.substring(0,4);
	console.log("item ", elem, tabl_year)
	var tabl_week = elem.substring(6,8);
	console.log("item ", elem, tabl_week)
		
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


// ====================================================

app.get('/dates2', function (req,res) {
	
	var CollectedOrganizedEvents = []
	
	function CollectAllTheEvents() {
		return new Promise(function(resolve,reject) {
		
			// 1. We collect the name of the tables of the db event through the function collectTablesInEventsDB
			collectTablesInEventsDB().then(collectionOfTables => {
				console.log("Principal log, result is : ", collectionOfTables)
				console.log("Longueur du collectionOfTables: ", collectionOfTables.length)
				
				var actionOnTable = collectionOfTables.map(tableTestAndQuery)
				
				var resultsOfTesting = Promise.all(actionOnTable)
				
				resultsOfTesting.then(rawData => {
				
				console.log(rawData)
				
				var filtered = rawData.filter(function (el) {
					return el != null;
				})
				
				console.log("FILTERED!!!", filtered)
					resolve(filtered)
				});
				
			})
		
		}) // Promise
			
	} // function CollectAllTheEvents
	
	CollectAllTheEvents().then(obtainedRawData => {
		console.log("!!!!!!!xxxx!!!!!!!", obtainedRawData)
	UniqueMapping(obtainedRawData)
	})
	
})

/*
function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}

async function delayedLog(item) {
  // notice that we can await a function
  // that returns a promise
  await delay();
  console.log(item);
}
async function processArray(array) {
  array.forEach(async (item) => {
    await func(item);
  })
  console.log('Done!');
}

processArray([1, 2, 3]);
*/

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

function tableTestAndQuery(elem) {
	
	return new Promise (function (resolve,reject) {
	
		// Obtain current year
		let now = new Date();
		var curr_year = dateModule.format(now, 'YYYY');
		console.log("Current Year is ", curr_year)

		// Obtain current week
		var curr_week = isoWeek();
		curr_week = 3 // DEBUG <-------------------------------------------
		console.log("Current week is ", curr_week)

		// Split text du table pour obtenir Year et Week
		var tabl_year = elem.substring(0,4);
		console.log("item ", elem, tabl_year)
		var tabl_week = elem.substring(6,8);
		console.log("item ", elem, tabl_week)

		// On loop dans les annees
		if (parseInt(tabl_year) < curr_year) {
		checkEventsInTheTable(elem).then(queryResult => {
			resolve(queryResult)
		})
		} else {

			if (parseInt(tabl_year) == curr_year) {
				// Deux cas de figure

				if (parseInt(tabl_week) < curr_week) {
				checkEventsInTheTable(elem).then(queryResult => {
				resolve(queryResult)
				})
				} else {
					if (parseInt(tabl_week) == curr_week) {
					checkEventsInTheTable(elem).then(queryResult => {
					resolve(queryResult)
					})
					} else {
					resolve()
					}
				}
			} else {
			resolve()
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
	
	
	console.log("NEW FUNCTION", finalCollection)
	
	
}
