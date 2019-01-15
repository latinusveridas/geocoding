
//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// VARIABLES
var mysql = require('mysql');
var mathjs = require('mathjs');

app.get('/postrating', function(req,res) {

//Debug
    var location = "fr"
    var organizer_id = "2019_01_O_bernard_organizer_id"
    var user_single_rating = "10"
    var user_comment = "Pas en forme Bernard"

    // We split the org_id to select the correct ratings table type 01_ratings_fr
    var month = organizer_id.split("_")
    var tableRat = month[1] + "_ratings_" + location
    
	CreatePool(location).then(currPool => {
	ConnectToDB(currPool).then(currCon => {
		
		var columns = " (organizer_id,user_comment,user_single_rating)"
		var baseStr = "INSERT INTO " + tableRat + columns + " VALUES (?)"
		
		var val = [
			organizer_id,
			user_comment,
			user_single_rating
			  ]
		
		var inserts = [val]
		var sql = mysql.format(baseStr, inserts)
		console.log(sql)		
		GoQuery(currCon,sql).then(resultPost => {
		
			// on query pour obtenir tous les ratings
			var baseStr = " SELECT user_single_rating FROM " + tableRat + " WHERE organizer_id = ? "
			var inserts = [organizer_id]
			var sql = mysql.format(baseStr,inserts)
			console.log(sql)
			GoQuery(currCon,sql).then(collectedRatings => {

			var arrRat = JSON.stringify(collectedRatings)
			arrRat = JSON.parse(arrRat)
			var onlyRatings = arrRat.map(curr => curr.user_single_rating);
			
			// Calcule de la note
			var GlobalNote = CalcGlobalRating(onlyRatings)
			console.log(GlobalNote)
				
			var baseStr = "UPDATE users_" + loc + " set organizer_rating = ? WHERE organizer_id = ?"
			var inserts = [GlobalNote,organizer_id]
			var sql = mysql.format(baseStr,inserts)
			console.log(sql)
			GoQuery(currCon,sql).then(resultUpdate => {
			console.log(resultUpdate)
				
			currCon.release()
			res.status(200).send("OK")				
			})
			

			})

		})

	})

	})
     
})

//=====SERVER LAUNCH========
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('RATING HELPER ON GOING');
});


// ============ HELPERS FUNCTIONS ====================

function CreatePool(loc) {

    return new Promise(function (resolve,reject) {
    
        var pool_rat = mysql.createPool({
        connectionLimit: 10,
        host: "83.217.132.102",
        port: '3306',
        user: "root",
        password: "Miroslava326356$$$$$",
        database: loc 
        })    
        
        resolve(pool_rat)
    })
}

function ConnectToDB(argPool) {
    
    return new Promise (function (resolve,reject) {

        argPool.getConnection(function (err, con) {

        if (err) {
        console.log(err)
        } else {
        console.log("Success to retrieve the connection")
        resolve(con)
        }
            
	})
    })
}
                        
function GoQuery(connection, query) {

	return new Promise(function(resolve,reject) {
		
		connection.query(query, function(err,result,fields) {	
				if (err) {
					return reject(err)
					console.log(err)
				} else {
					return resolve(result)
				}

		})
			
	})

}

function CalcGlobalRating(array) {
	
	// Counting elements in array
        var count = array.length
        // Sum of elements
        var sumMarks = mathjs.sum(array)
        // Calcul of rating
        var global_rat = sumMarks/count
	var rddRsl = mathjs.round(global_rat)
	return(rddRsl)
}




