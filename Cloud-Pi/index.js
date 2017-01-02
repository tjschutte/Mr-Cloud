/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const serialport = require('serialport');
const schedule = require('node-schedule');
const weather = require('openweather-node');
const port = new serialport('/dev/ttyUSB0', 9600);

// Global variable to turn checking weather on and off
var getWeather = true;
var quietHours = true;

// Other configuration variables
var quietStart = 22;
var quietEnd = 6;

/* Open weather configuration */
weather.setAPPID('bb3c7f07ddd4adcbee99aa50c6badef6');
weather.setCulture('en');
weather.setForecastType('daily');

/* seconds, minutes, hours, day-of-month, month, day-of-week */
/* this runs an event every minute */
var event = schedule.scheduleJob('*/60 * * * * *', function() {
  var date = new Date();
  var currentHour = date.getHours();
  var currentMinute = date.getMinutes();
  var data;
  if (getWeather) {
    console.log('Weather Mode enabled.');
    weather.now('Madison', function(err, json) {
      var sunrise = new Date(1000 * json.values.sys.sunrise);
      var sunset = new Date(1000 * json.values.sys.sunset);
      data = '0';
  
      if (currentHour == sunrise.getHours() && currentMinute >= sunrise.getMinutes()) {
        console.log('sunrise');
        data = '16'; //color for sunrise
      } else if (currentHour == sunset.getHours() && currentMinute >= sunset.getMinutes()) {
        console.log('sunset');
        data = '17' //color for sunset
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
      console.log('Changing mode to: ' + data);
      port.write(data);
    });
  }
  // If it is past bedtime, overwrite everything
  if (quietHours && (currentHour >= quietStart || currentHour <= quietEnd)) {
    console.log('Lights out');
    port.write('-1');
  }

});

/**
 * Create Express server.
 */
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

/** bodyParser.urlencoded(options)
* Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
* and exposes the resulting object (containing the keys and values) on req.body
*/
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
app.use(bodyParser.json());

/**
 * Primary app routes.
 */
app.get('/', function getIndex(req, res) {
  console.log('GET: /index');
  res.render('home.html'); 
});

app.post('/', function postIndex(req, res) {
  console.log('POST: /index');
  console.log('Changing mode to: ' + req.body.mode.mode);

  if (req.body.mode.mode == 1000)
    getWeather = false;
  else if (req.body.mode.mode == 1001)
    getWeather = true;
  else if (req.body.mode.mode == 2000)
    quietHours = false;
  else if (req.body.mode.mode == 2001)
    quietHours = true;
  else
    port.write(req.body.mode.mode);

  res.render('home.html');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
