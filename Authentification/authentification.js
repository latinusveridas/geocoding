// ====================================================== MODULES & VARIABLES ======================================================

// ROUTER
var express = require('express');
var router = express.Router();

// BODYPARSE
var bodyParser = require('body-parser')

// COMPONENTS
var DB = require('../Database/database');

//JSON WEB TOKEN
var jwt = require('jsonwebtoken');

var cors = require('cors');

var events = require('../Events/events')
var bookings = require('../Bookings/bookings')

var mysql = require('mysql');

var token;

router.use(cors())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

process.env.SECRET_KEY = 'test';

// ====================================================== MAIN FUNCTIONS ======================================================

router.post('/register', function (req, res) {
    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };

    var userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today,
        "jwt1": ""
    };

    var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }

    DB.DB.getConnection(function (err, conn) {
        if (err) {
            resMain.error = 1;
            resMain.error_description = "Internal Server Error";
            res.status(500).json(resMain);
        } else {
            conn.query('INSERT INTO users SET ?', userData, function (err, rows, fields) {
                if (!err) {
                    resMain.error = 0;
                    resMain.data = rows
                    resMain.success = 1
                    resMain.type_data = "SQL response"
                    console.log("REAL TIME INFORMATION : NEW USER SUCCESSFULLY REGISTERED !!");
                    res.status(201).json(resMain)
                } else {
                    resMain.error = 1
                    resMain.error_description = "Query failed"
                    res.status(400).json(resMain);
                    console.log(err);
                }
            });
            conn.release();
        }
    });

});

// ======================================LOGIN WILL GENERATE TOKEN 1 & TOKEN 2 ==============================================================

router.post('/login', function (req,res) {

    // Debug
    location = "fr"

    var emailreq = req.body.email;
    var pwreq = req.body.password;

    var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }

    DB.CreatePool(location).then(currPool => {
    DB.ConnectToDB(currPool).then(currCon => {

    var bas = `SELECT * FROM users_${location} WHERE email = ?`
    var inserts = [emailreq]
    var sql = mysql.format(bas,inserts)
    console.log(sql)

    DB.GoQuery(currCon,sql).then(rawRes => {

        if (rawRes.length > 0) {
            //console.log("log: Email founded in the DB OK");
            if (rawRes[0].password == pwreq) { 

                // CREATION OF TOKEN1 = LONG TOKEN USED FOR THE CONNECTION
                var salt = { "password": rawRes[0].password + "salt" }; //SALT ADDED TO DIFFERENTIATE THE TOKEN 1 OF THE TOKEN 2
                var token1 = jwt.sign(salt, 'test', { expiresIn: '12h' }); //LONG
                //console.log("log: Token1 long generated correctly");

                resMain.error = 0;
                resMain.data["JWT1"] = token1;
                var org_id = rawRes[0].organizer_id
                var user_id = rawRes[0].user_id
                var first_name = rawRes[0].first_name
                var last_name = rawRes[0].last_name
                var pic_name = rawRes[0].picture_link

                var bas = `UPDATE ${location}.users_${location} SET jwt1 = ? WHERE password = ? AND email = ?`
                var inserts = [token1,pwreq,emailreq]
                var sql = mysql.format(bas,inserts)
                //console.log(sql)

                DB.GoQuery(currCon,sql).then(rawRes => {

                resMain["error"] = 0;
                resMain["success"] = 1
                resMain.data = rawRes
                resMain.data["JWT1"] = token1
                resMain.data["JWT2"] = "" 
                resMain.data["organizer_id"] = org_id
                resMain.data["user_id"] = user_id
                resMain.data["first_name"] = first_name
                resMain.data["last_name"] = last_name
                resMain.data["pic_name"] = pic_name
                resMain.type_data = "RowDataPackets + data"
                res.status(200).json(resMain);

                }) // Go query


            } else {
                resMain["error"] = 1;
                resMain.error_description = "PW does not match";
                res.status(204).json(resMain);
                } 
             }  else {
                resMain["error"] = 1;
                resMain.error_description = "Email does not exists";
                res.status(204).json(resMain);
            }

    }) // Go Query
    currCon.release()
    }) // Connect DB
    }) // Create Pool



})



// ============================REFRESH THE JWT 2 THROUGH THE JWT 1 POSTED AND COMPARED TO THOSE STORED IN THE DATABASE============================================================
router.post('/refresh', function(req,res){

    // COLLECT THE JWT1
    var JWT1 = req.body.token1 || req.headers['jwt1'];

    // == DEBUG
    console.log("RECEIVED JWT1: ",JWT1)
    var location = "fr"


    // PREPARE THE RESULT
    var result = {
        "error": 0,
        "errorDescription": "",
        "jwt1": ""
    };

    var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }

    DB.CreatePool(location).then(currPool => {
    DB.ConnectToDB(currPool).then(currCon => {

    var bas = `SELECT * FROM users_${location} WHERE jwt1 = ?`
    var inserts = [JWT1]
    var sql = mysql.format(bas,inserts)

    DB.GoQuery(currCon,sql).then(rawRes => {

        if (rawRes.length > 0) {
            if (rawRes[0].jwt1 == JWT1) {
                //console.log("in success") /////////////
                //SUCCESS ON THE SEARCH OF THE TOKEN JWT1
                //CREATION OF token2 (SHORT)
                var token2 = jwt.sign({ "password": rawRes[0].password }, 'test', { expiresIn: "120000" });
                //console.log("CONSOLE TOKEN 2 IS ", token2)
                resMain.success = 1
                resMain.data["JWT2"] = token2;
                res.status(200).json(resMain);
            } else {
                //console.log("in err 2 (fail of search")
                resMain["error"] = 1;
                resMain.data["JWT2"] = "";
                resMain.error_description = "No token JWT found in the DB";
                res.status(204).json(resMain)
            }
        } else {
            //console.log("rawRes < 0")
            resMain.error = 1
            resMain.error_description = "No token found in the DB"
            res.status(401).json(resMain)
        }

    })
    currCon.release()
    })
    })


})




///////////////////////////////////////////////////////////////////////// PROTECTED AREA//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// =============================================CHECKPOINT USED TO CHECK THE TOKEN 2 TO OBTAIN ACCESS TO PROTECTED AREAS =======================================================
router.use(function (req, res, next) {

    var resMain = {
        "error": 0,
        "error_description": "",
        "success" : "",
        "type_data" : "",
        "data" : {}
    }

    var token = req.body.jwt2 || req.headers['jwt2'];

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err) {
            if (err) {
                resMain.error = 1
                resMain.error_description = "Token is invalid";
                res.status(401).json(resMain);
                console.log("Invalid Token, access refused")
            } else {
                next()
            }
        });
    } else {
        resMain.error = 1
        resMain.error_description = "No token"
        res.status(401).json(resMain)
        console.log("No token provided")
    }
})

router.use('/experlogin', events)
router.use('/bookings', bookings)

router.get('/getUsers', function (req, res) {

    var appData = {};

    DB.getConnection(function (err, conn) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData)
        } else {
            conn.query('SELECT * FROM users', function (err, rows, field) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows
                    res.status(200).json(appData)
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData)
                }
            })
            conn.release();
        }
    })

})

router.get('/all',function(req,res) {

    var targetTable = 'sampledb.events'

    DB.selectall(targetTable, function (callback) {
        res.send(callback)
    })

})



module.exports = router;