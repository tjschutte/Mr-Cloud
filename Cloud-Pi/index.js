const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const weather = require('openweather-node');
const config = require('./config.json');
var serialport;

Date.prototype.getUnixTime = function() { 
  return this.getTime()/1000|0 
};
if (!Date.now)
  Date.now = function() { 
    return new Date(); 
  }
Date.time = function() { 
  return Date.now().getUnixTime(); 
}

// debug sets some startup features like weather and quiethours to false. 
// dev mode stops us from doing serial items incase the machine does not have that ability
var debug = (process.argv[2] == 'debug' || process.argv[3] == 'debug');
var devMode = (process.argv[2] == 'dev' || process.argv[3] == 'dev');

// Global variable to turn checking weather on and off
var weatherMode = config.weatherMode;
var quietHours = config.timerMode;

// Other configuration variables
var quietStart = config.quietStart;
var quietEnd = config.quietEnd;

/* Open weather configuration */
weather.setAPPID(config.weatherAPIKey);
weather.setCulture(config.weatherCulture);
weather.setForecastType(config.weatherForecastType);

// Serial port.
var port = null;

if (!devMode){
  serialport = require('serialport');
  // Serial port used to talk to arduino which talks to lights.
  port = new serialport('/dev/ttyUSB0', 9600);  
}

/* seconds, minutes, hours, day-of-month, month, day-of-week */
/* this runs an event every minute */
var event = schedule.scheduleJob('*/60 * * * * *', function() {
  var data = '0';

  if (weatherMode) {
    console.log('Weather Mode enabled.');
    weather.now(config.location, function(err, json) {

      if (sunEvent(json.values.sys.sunrise)) {
        console.log('Sunrise!')
        data = '16'; // color for sunrise
      } else if (sunEvent(json.values.sys.sunset)) {
        console.log('Sunset!')
        data = '17' // color for sunset
      } else {
        // If there has been some rain, lets do some lightning
        console.log(json.values.weather[0].main);
        if (json.values.weather.main == 'Rain') {
          var rand = Math.random();
          data = (rand < 0.2 ? '18' : '2'); // set to more common lighting, or light blue for rain
          data = (rand < 0.08 ? '18' : '6'); // set it to lightning, or light blue for rain
        } else if (json.values.weather[0].main == 'Clear') {
          data = '15'; // weather is clear, make it sunny
        }
      }
    });
  }
  // If it is past bedtime, overwrite everything
  if (isQuietHours() && quietHours) {
    console.log('Lights out')
    data = '-1';
  }
  console.log('Changing mode to: ' + data);
  if (!devMode) {
    port.write(data);
  }
});

const app = express();
app.set('port', 80);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Get the main page when someone navigates to the server.
app.get('/', function getIndex(req, res) {
  console.log('GET: /index');
  res.render('home.html');
});

// Post takes values back from the user and updates the arduino.
app.post('/', function postIndex(req, res) {
  console.log('POST: /index');
  console.log('Changing mode to: ' + req.body.mode.mode);

  if (!devMode) {
    switch(req.body.mode.mode) {
      case 1000:
        weatherMode = false;
        break;
      case 1001:
        weatherMode = true;
        break;
      case 2000:
        quietHours = false;
        break;
      case 2001:
        quietHours = true;
        break;
      default:
        port.write(req.body.mode.mode);
        break;
    }
  }
  res.render('home.html');
});

// 15 minutes * 60 seconds * 1000 milli seconds. 
// Used in sunrise / set calculations.
const sunPeriod = (15 * 60);

// Returns if the time allows for sunrise / sunset
function sunEvent(time) {
  var date = (+ new Date()) / 1000;
  var beforeBuffer = time - sunPeriod;
  var afterBuffer = time + sunPeriod;
  if (date > beforeBuffer && date < afterBuffer) {
    return true
  }
  return false;
};

function isQuietHours() {
  var hour = new Date().getHours;
  return hour > quietStart || hour < quietEnd;
};

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
