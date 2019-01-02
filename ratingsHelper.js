// VARIABLES
var mysql = require('mysql');

// DEFINE POOLING
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "83.217.132.102",
    port: '3306',
    user: "root",
    password: "Miroslava326356$$$$$",
    database: "ratings_db"
});

module.exports.pool = pool;

// =====================================================

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
        console.log(global_rat)
        
    });
    

res.status(200).send(xxxxx)

});


// ============ HELPERS FUNCTIONS ====================

function selectonecolumn(table, col1, callback) {

    pool.getConnection(function (err, con){
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
