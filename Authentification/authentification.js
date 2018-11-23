// ====================================================== MODULES & VARIABLES ======================================================

// ROUTER
var express = require('express');
var router = express.Router();

// BODYPARSE
var bodyParser = require('body-parser')

// COMPONENTS
var database = require('../Database/database');

//JSON WEB TOKEN
var jwt = require('jsonwebtoken');

var cors = require('cors');

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

    database.pool.getConnection(function (err, conn) {
        if (err) {
            appData.error = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            conn.query('INSERT INTO users SET ?', userData, function (err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully !!!";
                    console.log("REAL TIME INFORMATION : NEW USER SUCCESSFULLY REGISTERED !!");
                    res.status(201).json(appData);
                } else {
                    appData["data"] = "Error occured";
                    res.status(400).json(err);
                    console.log(err);
                }
            });
            conn.release();
        }
    });

});

// ======================================LOGIN WILL GENERATE TOKEN 1 & TOKEN 2 ==============================================================
router.post('/login', function (req, res) {

    var appData = {
        "error": "0",
        "errorDescription": "",
        "JWT1": "",
        "JWT2": ""
    };

    var emailreq = req.body.email;
    var pwreq = req.body.password;

   pool.getConnection(function (err, conn) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            conn.query('SELECT * FROM sampledb.users WHERE email = ?', [emailreq], function (err, rows, fields) {
                console.log("DEBUG EMAIL RECEIVED FROM THE CLIENT : " + emailreq);
                if (err) {
                    appData["error"] = 1;
                    appData["data"] = "Error occured";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        console.log("ONE EMAIL ADRESS FOUND IN THE DB AND PASSWORD WILL BE TESTED NOW");
                        if (rows[0].password == pwreq) {

                            console.log("PASSWORD MATCHING ! :)");

                            //CREATION TOKEN2 = SHORT TOKEN USED FOR THE CONNECTION
                            var token2 = jwt.sign({ "password": rows[0].password }, 'test', { expiresIn: "120000" }); //SHORT //BASIC VALUE IN MS SO 1min = 60 000 AND 2MIN = 2*60 000
                            console.log("token2 short generated correctly");

                            // CREATION OF TOKEN1 = LONG TOKEN USED FOR THE CONNECTION
                            var salt = { "password": rows[0].password + "salt" }; //SALT ADDED TO DIFFERENTIATE THE TOKEN 1 OF THE TOKEN 2
                            var token1 = jwt.sign(salt, 'test', { expiresIn: '12h' }); //LONG
                            console.log("Token1 long generated correctly");

                            console.log("JWT1 LONG = " + token1);
                            console.log("JWT2 SHORT = " + token2);

                            appData.error = 0;
                            appData["JWT1"] = token1;
                            appData["JWT2"] = token2;

                            // STARTING THE QUERY TO LOAD THE JWT2 IN THE DATABASE
                            conn.query('UPDATE sampledb.users SET jwt1 = ? WHERE password = ? AND email = ?', [token1,pwreq,emailreq], function (err, rows, fields) {
                                if (err) {
                                    res.json(err);
                                } else {
                                    console.log("QUERY LOAD JWT1 / IN SUCCESS BRACES :)");
                                    appData["errorDescription"] = rows;
                                    res.status(200).json(appData);
                                }
                            });

                            

                        } else {
                            appData["error"] = 1;
                            appData["data"] = "PW does not match";
                            res.status(204).json(appData);
                        }
                    }
                    else {
                        appData["error"] = 1;
                        appData["data"] = "email does not exists";
                        res.status(204).json(appData);
                    }
                }
            }); //END OF QUERY SELECT EMAIL TO FIND THE USER


            

        }
        
        conn.release();

    }); 

});



// ============================REFRESH THE JWT 2 THROUGH THE JWT 1 POSTED AND COMPARED TO THOSE STORED IN THE DATABASE============================================================
router.post('/refresh', function (req, res) {

    //==========DATABASE INFORMATION=============
    //      jwt1 field name is : jwt1

    // COLLECT THE JWT2
    var JWT1 = req.body.token1 || req.headers['jwt1'];

    // PREPARE THE RESULT
    var result = {
        "error": 0,
        "errorDescription": "",
        "jwt1": ""
    };

    console.log("REAL TIME INFO : ", JWT1)

    // GO IN THE DATABASE
    database.pool.getConnection(function (err, conn) {
        if (err) {
            res.status(500).json(err);
        } else {
            // LAUNCH THE QUERY
            conn.query('SELECT * FROM sampledb.users WHERE jwt1 = ?', [JWT1], function (err, rows, field) {
                if (err) {
                    // ERROR ON QUERY
                    res.status(400).json(err);
                } else {
                    // SUCCESS ON QUERY
                    if (rows[0].jwt1 == JWT1) {
                        //SUCCESS ON THE SEARCH OF THE TOKEN JWT1
                        //CREATION OF token2 (SHORT)
                        var token2 = jwt.sign({ "password": rows[0].password }, 'test', { expiresIn: "120000" });
                        result["jwt2"] = token2;
                        res.status(200).json(result);
                    } else {
                        // FAIL ON THE SEARCH OF JWT2
                        result["error"] = 1;
                        result["jwt2"] = "";
                        result["errorDescription"] = "No token JWT found in the DB";
                        res.status(204).json(result)

                    }

                }

            });

            conn.release();

        }


    });

});


///////////////////////////////////////////////////////////////////////// PROTECTED AREA//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// =============================================CHECKPOINT USED TO CHECK THE TOKEN 2 TO OBTAIN ACCESS TO PROTECTED AREAS =======================================================
router.use(function (req, res, next) {
    var token = req.body.jwt2 || req.headers['jwt2'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err) {
            if (err) {
                appData.error = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData.error = 1;
        appData["data"] = "No token";
        res.status(403).json(appData);
    }
});



router.get('/getUsers', function (req, res) {

    var appData = {};

    database.pool.getConnection(function (err, conn) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            conn.query('SELECT * FROM users', function (err, rows, field) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            conn.release();
        }
    });

});



module.exports = router;
