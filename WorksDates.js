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

// =====================================================

app.get('/dates', function(req, res) {
    console.log("log : Launch of Date debug for databases")

    
// PRELIMINARY WORKS
    
    var collected_events = [] 
    var organizer_id = "debug_organizer_id_1"
    
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
    
    basicquery(coll_tables, function (callback) {
    collection_tables = callback.map(v => v.Tables_in_events);
    console.log(collection_tables);
        
     // ! Now we know the tables to check ! 
        
     // We loop through each element of the collection_table to obtain year and week
              
        for (i = 0; i < collection_tables.length; i++) {
            
            var elem = collection_tables[i]
            
            // Split text pour obtenir Year et Week
            var tabl_year = elem.substring(0,4);
            //console.log("item ", elem, tabl_year)
            
            var tabl_week = elem.substring(6,8);
            //console.log("item ", elem, tabl_week)
            
            // On loop dans les annees
            if (parseInt(tabl_year) < curr_year) {
                // = Paste year, we check all tables
            console.log("// 1 table year inferior to current year")
                
                // organizer_id = "debug_organizer_id_1"
                var selec_query = "SELECT * FROM " + elem + " WHERE organizer_id = " + organizer_id
                
                basicquery(select_query, function (callback) {
                collected_events.push(callback)
                
                
            } else {
            
                if (parseInt(tabl_year) == curr_year) {
                    // = Current Year, we check the weeks
                console.log("table year equal current year")
                    
                    if (parseInt(tabl_week) < curr_week) {
                        // = Previous week, we test the table
                    console.log("Table to be check is ",elem)
                        
                    } else {
                        if (parseInt(tabl_week) == curr_week) {
                            // = We are in present events tables
                            
                        } else {
                        
                        }
                    console.log("table week superior of current week")
                        
                    }
                    
                } else {
                
                }
                
                
				}); // 1 table year inferior to current year
				
            }

            
        }
        
    });
    
            
    
    console.log("end of dates function, result is ",collected_events)
    res.status(200).send("OK")
    
});

// ================ SERVER LAUNCH ======================
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('WORKS DATES ON GOING');
});

// ================ HELPERS ==========================



// =================== DATABASES FUNCTIONS ==============================

function basicquery(query, callback) {

    pool_events.getConnection(function (err,con) {

        if (err) {
            console.log(err)
        } else {
            console.log("Success to retrieve the connection")

            con.query(query, function(err,result,fields){
                if (err) {

                    console.log(err)
                } else {

                    console.log("log: basic/query function success, # of RowDataPacket sent: ", result.length)
                    callback(result)
                }

            })
        }

        con.release();
    })

}
