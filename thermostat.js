var http    = require('http');
var https   = require('https');
var url     = require('url');
var qstring = require('querystring');
var fs      = require('fs');

var date     = new Date();       //Get current date and time
var cur_hour = date.getHours();  //Get Hours from current time
var cur_miin = date.getMinutes();//Get minutes from current time
var roomTemp = 20;               //Room Temperature
var desTemp  = 20;               //Desired Temperature
var hysteresis  = 2;           
var tempOutside = 0;             //Temperature Outside
var onOff = "ON";                //Thermostat ON/OFF
var isOn  = 'on' ;               //Box on html page checked/unchecked
var weather  = "Unknown";        //Weather in current city(Ottawa)
var checkbox = '';               //Checkbox checked/unchecked

var options = {
    key: fs.readFileSync('serverkey.pem'),
    cert: fs.readFileSync('servercert.crt')
};

//Thermostat interface
function sendPage() {
    var page = '<head><title>Thermostat</title>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
        '<style type="text/css">'+
        'p { height: 150px;width: 150px;}'+
    'body {background-image: linear-gradient(270deg,rgb(10,233,233) 0%,rgb(218,221,221) 100%);}'+
        'html {color: #545454;font-family: Optima;}'+
        'button {background-color: black; }'+
        'tbody {background-color: #99FFFF;}'+
        'td {text-align: center;}'+
        'h1 {text-align: center;margin: auto;}'+
        'input {display: table-cell;border-radius: 5px;border-width: 2px;margin:auto;}'+
        '</style><body> <h1>Thermostat</h1><table><form method="get"><tbody><tr>'+
	    '<td>ON/OFF</td><td>Current time</td><td></td><td>Inside</td>'+
        '<td></td><td>Outside</td><td>Set Desired Temperature</td></tr><tr>'+
        '<td ><INPUT type="checkbox" name="onoff" '+checkbox+'></td>'+
	    '<td style="font-size: 50px">'+cur_hour+":"+cur_miin+'</td><td></td>'+
	    '<td style="font-size: 50px">'+roomTemp+' &#8451</td><td></td>'+
	    '<td style="font-size: 50px">'+tempOutside+' &#8451<br>' + weather + '</td>'+
        '<td>Current Desired Temp: ' + desTemp+'<br><br>'+
        '<input type="number" name="des" value="20"><br>'+
        '<br></td>'+
	    '</tr><tr><td>State: ' + isOn+'</td>'+
	    '<td></td><td></td>'+
        '<td></td><td></td><td>City: Ottawa</td>'+
        '<td><input type="submit" value="Submit/Refresh"</td></tr>'+
	    '</tbody></table></form></body>';
     
  return page;
}

//Reads response with Weather data, sets values for weather and tempOutside
function parseWeather(weatherResponse) {
  var weatherData = '';    
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    var pp2 = JSON.parse(weatherData);
    weather = pp2.weather[0].main;
    tempOutside = Math.round((pp2.main.temp - 273.15)*100)/100; //Converts from Kelvin to Celsius
  });
    
}

//Sends request to weather site and recieves response(weather data)
function getWeather(){
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=Ottawa'
  };
  http.request(options, function(weatherResponse){
    parseWeather(weatherResponse);
  }).end();
}

//Sets new values from data for isOn, checkbox and desTemp
function settings(data) {
    if(data.onoff == 'on'){
        isOn = 'on';
        checkbox = 'checked="checked"';
    }
    else {
        isOn = 'off';
        checkbox = "";
    }
    if(data.des != '')  desTemp = parseInt(data.des);  //Changes recived string to int
}

//Set onOff value according to the room temperature and isOn state
function checkOnOff() {
    if((roomTemp < desTemp-hysteresis) && isOn == 'on'){
        onOff = "ON";
    }
    if(roomTemp > desTemp+hysteresis || isOn == 'off'){
        onOff = "OFF";
    }
}

//Change room temperature according to thermostat state
function temp() {
    if(onOff == "ON") {
        console.log("Room temperature: " + roomTemp++);   
    }
    else if(onOff == "OFF"){
        console.log("Room temperature: " + roomTemp--);   
    } 
}

//Update current time
function updateTime() {
    date = new Date();
    cur_hour = date.getHours();
    cur_miin = date.getMinutes();
    
}

getWeather();

http.createServer(function (req, res) {
    
  getWeather();
  updateTime();
  
  //Usually used by furnace
  if (req.method == "POST"){
    var reqData = '';
    req.on('data', function (chunk) {
      reqData += chunk;
    });
    req.on('end', function() {
       var pp2 = JSON.parse(reqData);
       checkOnOff(); 
       temp();
       var resObj = {'onOff' : onOff};
       res.end(JSON.stringify(resObj));
    });
   } 
    
   //Usually used for getting browser response
   else if (req.method == "GET"){
     var urlObj = url.parse(req.url, true, false);
     var query = urlObj.query;
     var ar = {};  //Array for objects from urlObj
       
     for(x in urlObj.query) {
          ar[x] = urlObj.query[x];
     }
       
     settings(ar);
     var page = sendPage();
       
     res.end(page);
  }
  else{   
    var page = sendPage();
    res.end(page);
  }
}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');

