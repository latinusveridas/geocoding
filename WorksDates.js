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
    
    // Collected tables in events db
    var coll_tables = 'SHOW TABLES'
    var collection_tables = []
    basicquery(coll_tables, function (callback) {
        console.log(callback)
        collection_table = JSON.stringify(callback)
        console.log(collection_table)
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
