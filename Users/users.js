// ====================================================== MODULES & VARIABLES ======================================================

//DATABASE
var DB = require('../Database/database');

//RANDOM STRING
var rdmString = require('randomstring');

//DATE & TIME
var datetime = require('node-datetime');

// ROUTER
var express = require('express');
var router = express.Router();

// MYSQL
var mysql = require('mysql');

// ====================================================== MAIN FUNCTIONS ======================================================

router.get('/register', function (req, res) { //TO BE MODIFIED TO POST

    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var password = req.body.password
    var date_time_creation = ""
    var jwt1 = ""

    //AppData is the status of the process, generally sent back to the user
    var appData = {
        "error": 1,
        "data": ""
    };

    //Definition of the User class
    var now = datetime.create();
    var now = now.format('Y-m-d H:M:S')

    //GENERATE USER ID
    var dt = datetime.create();
    var dt = dt.format('Y_m')
    var userID = dt + '_U_' + rdmString.generate(40) ;
    console.log("GENERATED User_ID: " + userID) 

    var userData = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password,
        "created": now,
        "jwt1": ""
    };

    //Definition of the parameters to push in the InsertInto function
    var table = 'sampledb.users';

    var columns = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'created'
    ]

    var values = [
        "'" + userID + "'",
        "'" + userData.first_name + "'",
        "'" + userData.last_name + "'",
        "'" + userData.email + "'",
        "'" + userData.password + "'",
        "'" + now + "'"
    ]

    //console.dir(values)

    // # Launch the database insertion 
    DB.insertSpecific(table, columns, values, function(callback) {
        res.send(callback);

    });
    
});

router.get('/view', function (req, res) {

    //Assumptions : We receive in the req.body the userID of the user
    //var reqUserID = '2018_11_U_tglNGhK8bavYs6MVHAswuYpiX6gV7mJCy0HSghzO';

    var user_id = req.body.user_id
    
    //Definition of the tables and column
    var table = 'sampledb.users';

    var column = 'user_id';

    DB.selectonerow(table,column,user_id,function(callback){
        res.send(callback)
    });



});

module.exports = router;

router.post('/orgidview', function (req,res) {

    //DEBUG
    var location = "fr"
    var org_id = ""
    
    DB.CreatePool(location).then(currPool => {
    DB.CreateConnection(currPool).then (currCon => {
        
    var bas = `SELECT first_name, user_single_rating from users_${location} WHERE organizer_id = ?`
    var inserts = [org_id]
    var sql = mysql.format(bas,inserts)
        
        DB.GoQuery(currCon,sql).then(rawRes => {
        console.log(rawRes)
        
        })
        
    })
    currCon.release()
    })
    
})
