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

function insertinto (table,values) {

    pool.getConnection(function(err,con){
        if (err) {
            console.log(err)
        } else {
            console.log('Success on connection to the database')
                //PREPARATION OF THE QUERY
                var targetQuery = 'INSERT INTO ' + table + ' VALUES ( ' + values + ')';
                
                //QUERY
                con.query(targetQuery,function(err,result,fields){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(result)
                        console.log("Success in insert")
                    }

                });
        }
    });
};

module.exports.insertinto = insertinto;

