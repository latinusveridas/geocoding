
//EXPRESS
var express = require('express');
var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var possibleSports = [
    "Yoga",
    "Running",
    "Canoe",
    "Sailing",
    "Bowling",
    "Snooker",
    "Zumba",
    "Crossfit",
    ];

 
app.get('/sports',function(req, res) {
    console.log("in sports !")

res.status(200).send(possibleSports)

});

/*func nbSportsAvailable() {
  
var nb = possibleSports.length
console.log("There is ",nb," available sports in cache system")
  
}*/

//=====SERVER LAUNCH========
// Helper on port 3001
app.listen(3001,function(req,res){
    console.log('HELPER ON GOING');
});
