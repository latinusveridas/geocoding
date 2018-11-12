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

    console.log("INSIDE INSERT INTO FUNCTION");

    pool.getConnection(function (err, con) {
        if (err) {
            console.log(err)
            callback(err)
        } else {
            console.log('Success on connection to the database')
            //PREPARATION OF THE QUERY
            var targetQuery = 'INSERT INTO ' + table + ' VALUES ( ' + values + ')';

            //QUERY
            con.query(targetQuery, function (err, result, fields) {
                if (err) {
                    console.log(err)
                    callback(err)
                } else {
                    console.log(result)
                    console.log("Success in insert")
                    callback('Success');
                }

            });
        }
        con.release();
        console.log('CONNECTION RELEASED');

    });

}

module.exports.insertinto = insertinto;

function selectonerow(table, targetcolumn, value) {

    console.log("INSIDE SELECT ONE ROW WITH ONE VALUE");

    pool.getConnection(function (err, con) {

        if (err) {
            console.log(err)

        } else {
            console.log("Success to get the connection")

            //Preparation of the query
            var targetQuery = 'SELECT * from ' + table + 'WHERE ' + targetcolumn + ' = ' + value;

            con.query(targetcolumn, function (err, result, fields) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }

            })

        }

        con.release();
    })

}

module.exports.selectonerow = selectonerow;

