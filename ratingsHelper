var mysql = require('mysql');

//DEFINE POOLING
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "83.217.132.102",
    port: '3306',
    user: "root",
    password: "Miroslava326356$$$$$",
    database: "sampledb"
});

module.exports.pool = pool;

function selectall(table, callback) {

    pool.getConnection(function (err, con){

        if (err) {
            
            console.log(err)
        } else {
            console.log("Success to retrieve the connection")
         
            //Preparation of the query
            var targetQuery = 'SELECT * FROM ' + table;
            
            console.log(targetQuery);

            con.query(targetQuery, function (err,result,fields){
                if (err) {
                    
                    console.log(err)
                } else {
                    console.log("Real-Time Debug : get/all function success, # of RowDataPacket sent: ", result.length)
                    callback(result) //<---- SUCCESS
                }

            });

        }

    con.release();
        
    });

}
