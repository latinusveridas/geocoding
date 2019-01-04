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
    
    // Obtain current year
    let now = new Date();
    var curr_year = dateModule.format(now, 'YYYY');
    console.log("Current Year is ", curr_year)
    
    // Obtain current week
    var curr_week = isoWeek();
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
            console.log("item ", elem, tabl_year)
            
            var tabl_week = elem.substring(7,8)
            console.log("item ", elem, tabl_week)
            
        }
            
}
      
        
    });
    
});

//================ SERVER LAUNCH ======================
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('WORKS DATES ON GOING');
});

// ================ HELPERS =========================



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
