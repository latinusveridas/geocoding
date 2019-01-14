
//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// VARIABLES
var mysql = require('mysql');

// DEFINE POOLING
var pool_rat = mysql.createPool({
    connectionLimit: 10,
    host: "83.217.132.102",
    port: '3306',
    user: "root",
    password: "Miroslava326356$$$$$",
    database: "ratings_db"
});

module.exports.pool_rat = pool_rat;

// =====================================================
//    BRAND NEW
// =====================================================

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

app.get('/postrating', function(req,res) {

//Debug
    var location = "fr"
    var organizer_id = "2019_01_O_bernard_organizer_id"
    var user_single_rating = "7"
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
			var insert = [organizer_id]
			var sql = mysql.format(baseStr,insert)
			console.log(sql)
			GoQuery(currCon,sql).then(collectedRatings => {

			var arrRat = JSON.stringify(collectedRatings)
			var arr2 = JSON.stringify(arrRat)
			console.log(arr2)
			var mapped = arr2.map(curr => curr.user_single_rating);
			console.log(mapped)
			currCon.release()
			res.status(200).send(arrRat)
			})

		})

	})

	})
     
})












app.get('/ratings', function(req, res) {
    console.log("in ratings !")
    
var resMain = {
    "error": 0,
    "error_description": "",
    "success" : "",
    "type_data" : "",
    "data" : {}
}
    
    var coach_id = req.body.coach_id
    
    // Define table name
    var rat_table = "RAT_"+ coach_id
    
    // Define column
    var target_col = "mark"
    
    //Calling database
    selectonecolumn(rat_table,target_col, function (feedback) {
    
        var arr_result = JSON.stringify(feedback)
        console.log(arr_result)
        
        // Counting elements in array
        var count = arr_result.lenght
        
        // Sum of elements
        var sumMarks = sum(arr_result)
        
        // Calcul of rating
        var global_rat = sumMarks/count
        
        // Update of global rating in coach table
        // Define query
        
        var trgQuery = 'UPDATE ' + rat_table + ' SET ' + target_col + ' = ' + global_rat + ' WHERE ' +  'organizer_id = ' + coach_id
        console.log(global_rat)
        console.log(trgQuery)
        
        pool.basicquery(trgQuery, function (callback) {
        console.log(callback)
        });
        
    });
    

res.status(200).send(xxxxx)

});

//=====SERVER LAUNCH========
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('RATING HELPER ON GOING');
});


// ============ HELPERS FUNCTIONS ====================

function selectonecolumn(table, col1, callback) {

    pool_rat.getConnection(function (err, con){
        if (err) {
            console.log(err)
        } else {
            console.log("Success to retrieve the connection")
         
            //Preparation of the query
            var targetQuery = 'SELECT ' + col1 + ' FROM ' + table;
            
            console.log(targetQuery);

            con.query(targetQuery, function (err,result,fields){
                if (err) {  
                    console.log(err)
                } else {
                    console.log("log: Result length is ", result.length)
                    callback(result) //<---- SUCCESS
                }

            });
        }
    con.release();        
    });
}

function basicquery(query, callback) {

    pool.getConnection(function (err,con) {

        if (err) {
            console.log(err)
        } else {
            console.log("Success to retrieve the connection")

            con.query(query, function(err,result,fields){
                if (err) {

                    console.log(err)
                } else {

                    console.log("Real-Time Debug : basic/query function success, # of RowDataPacket sent: ", result.length)
                    callback(result)
                }

            })
        }

        con.release();
    })


}

function sum(input){       
 if (toString.call(input) !== "[object Array]")
    return false;
            var total =  0;
            for(var i=0;i<input.length;i++)
              {                  
                if(isNaN(input[i])){
                continue;
                 }
                  total += Number(input[i]);
               }
             return total;
}
