var fs = require('fs');
var http = require('http');

var onOff = true;

var options = {
  hostname: 'localhost',
  port: '3000',
  path: '/',
  method: 'POST',
}

//Reads response from server and prints to console the state of furnace(ON/OFF)
//according to recieved data
function readJSONResponse(response){
  var responseData = '';
  response.on('data', function(chunk){responseData += chunk});
  response.on('end', function(){
    var dataObj = JSON.parse(responseData);

    if(dataObj.onOff == "ON"){
	 console.log("Furnace: ON");
	 onOff = true;
   }
    else {
	console.log("Furnace: OFF ");
        onOff = false;
    }
    onOff = dataObj.ison;
  });
}

//Recursivelly sends requests to server, asking if thermostat is on/off
var req;
setTimeout( function again(){
   req = http.request(options, readJSONResponse);
   if(onOff)
        req.write('{"isOn": true}');
   else req.write('{"isOn": false}');
   req.end();
   setTimeout(again, 3000); //recursively restart timeout

   }, 3000);



