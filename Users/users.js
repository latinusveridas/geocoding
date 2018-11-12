// ====================================================== MODULES & VARIABLES ======================================================

//DATABASE
var db = require('../Database/database');

//RANDOM STRING
var rdmString = require('randomstring');

//DATE & TIME
var datetime = require('node-datetime');

// ROUTER
var express = require('express');
var router = express.Router();

// ====================================================== MAIN FUNCTIONS ======================================================

router.get('/register', function (req, res) { //TO BE MODIFIED TO POST

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
        "first_name": 'Henri',
        "last_name": 'Leconte',
        "email": 'henrileconte@gmail.com',
        "password": '2548',
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
    db.insertSpecific(table, columns, values, function(callback) {
        res.send(callback);

    });
    
});

router.get('/view', function (req, res) {

    //Assumptions : We receive in the req.body the userID of the user
    var reqUserID = '2018_11_U_tglNGhK8bavYs6MVHAswuYpiX6gV7mJCy0HSghzO';

    //Definition of the tables and column
    var table = 'sampledb_users';

    var column = 'user_id';

    db.selectonerow(table,column,reqUserID,function(callback){
        res.send(callback)
    });


});

module.exports = router;
