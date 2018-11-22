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

function insertinto(table, values, callback) {

    pool.getConnection(function (err, con) {
        if (err) {
            console.log(err)
            callback('Error')
        } else {
            console.log('RT INFO : Success on connection to the database :)')
            //PREPARATION OF THE QUERY
            var targetQuery = 'INSERT INTO ' + table + ' VALUES ( ' + values + ')';

            //QUERY
            con.query(targetQuery, function (err, result, fields) {
                if (err) {
                    console.log(err)
                    callback('Error')
                } else {
                    callback('Success'); //<== SUCCESS CALLBACK
                }

            });
        }
        con.release();

    });

}

module.exports.insertinto = insertinto;


function insertSpecific(table, columns, values, callback) {

    pool.getConnection(function (err, con) {
        if (err) {
            console.log(err)
            callback('Error')
        } else {
            console.log('RT INFO : Success on connection to the database :)')
            //PREPARATION OF THE QUERY
            var targetQuery = 'INSERT INTO ' + table + ' (' + columns + ') VALUES ( ' + values + ')';
            //console.log(targetQuery);

            //QUERY
            con.query(targetQuery, function (err, result, fields) {
                if (err) {
                    console.log(err)
                    callback('Error')
                } else {
                    callback('Success'); //<== SUCCESS CALLBACK
                }

            });
        }
        con.release();

    });

}

module.exports.insertSpecific = insertSpecific;

function selectonerow(table, targetcolumn, value, callback) {

var value = "'" + value + "'";

console.log("INSIDE SELECT ONE ROW WITH ONE VALUE");

    pool.getConnection(function (err, con) {

        if (err) {
            console.log(err)

        } else {
            console.log("Success to get the connection")

            //Preparation of the query
            var targetQuery = 'SELECT * FROM ' + table + ' WHERE ' + targetcolumn + ' = ' + value;

            console.log(targetQuery);

            con.query(targetQuery, function (err, result, fields) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                    callback(result);
                }

            })

        }

        con.release();
    })

}

module.exports.selectonerow = selectonerow;

function selectall(table, callback) {

    pool.getConnection(function (err, con){

        if (err) {
            console.log(err)
        } else {
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

module.exports.selectall = selectall;

