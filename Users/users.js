//THIS IS THE USER PART

//Loading database
var db = require('../Database/database');



user.post('/register', function (req, res) {

    //AppData is the status of the process, generally sent back to the user
    var appData = {
        "error": 1,
        "data": ""
    };

    //Definition of the User class
    var today = new Date();

    var userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today,
        "jwt1": ""
    };

    //Definition of the parameters to push in the InsertInto function
    var table = 'sampledb.users';

    var values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password,
        today
    ];

    // # Launch the database insertion 
    db.insertinto(table, values);
    
});

user.post('/view', function (req, res) {

    //Assumptions : We receive in the req.body the userID of the user
    var reqUserID = req.body.userID

    //Definition of the tables, values and 




});

