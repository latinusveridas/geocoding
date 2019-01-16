//EXPRESS
var express = require('express');
var app = express();

//BODYPARSER
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// VARIABLES
var mathjs = require('mathjs');



app.get('/inside', function (req,res) {


google.maps.event.addListener(map, 'click', function(event) {
  var click = event.latLng;
  var locs = {lat: event.latLng.lat(), lng: event.latLng.lng()};
  var n = arePointsNear(user, locs, diameter);

     if(n){
    marker = new google.maps.Marker({
      map: map,
      position: locs,
      label: {
        text:"I", //marking all jobs inside radius with I
        color:"white"
      }
    });
         
           }else{
    marker = new google.maps.Marker({
      map: map,
      position: locs,
      label: {
        text:"O", //marking all jobs outside radius with O
        color:"white"
      }
    });
  }
});


})


//=====SERVER LAUNCH========
// Helper on port 3001
app.listen(3002,function(req,res){
    console.log('GEO WORKS ON GOING');
});

function arePointsNear(checkPoint, centerPoint, km) { 
   var ky = 40000 / 360;
   var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
   var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
   var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
   return Math.sqrt(dx * dx + dy * dy) <= km;
}
