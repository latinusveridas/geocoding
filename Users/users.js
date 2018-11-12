// ====================================================== MODULES & VARIABLES ======================================================

//DATABASE
var db = require('../Database/database');

//RANDOM STRING
var rdmString = require('randomstring');

// ROUTER
var express = require('express');
var router = express.Router();

router.post('/register', function (req, res) {

    //AppData is the status of the process, generally sent back to the user
    var appData = {
        "error": 1,
        "data": ""
    };

    //Definition of the User class
    var today = new Date();

    //GENERATE USER ID
    var dt = datetime.create();
    var dt = dt.format('Y_m')
    var userID = dt + '_U_' + rdmString.generate(40) ;
    console.log("GENERATED User_ID: " + userID) 

    var userData = {
        "first_name": req.body.first_name || 'Henri',
        "last_name": req.body.last_name || 'Leconte',
        "email": req.body.email || 'henrileconte@gmail.com',
        "password": req.body.password || '2548',
        "created": today,
        "jwt1": ""
    };

    //Definition of the parameters to push in the InsertInto function
    var table = 'sampledb.users';

    var columns = [
        user_id,
        first_name,
        last_name,
        email,
        password,
        created
    ]

    var values = [
        userID,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password,
        today
    ]

    // # Launch the database insertion 
    db.insertSpecific(table, columns, values, function(callback) {
        res.send(callback);

    });
    
});

router.post('/view', function (req, res) {

    //Assumptions : We receive in the req.body the userID of the user
    var reqUserID = req.body.userID

    //Definition of the tables, values and 

});

module.exports = router;