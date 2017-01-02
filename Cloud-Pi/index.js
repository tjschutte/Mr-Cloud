/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const serialport = require('serialport');
const schedule = require('node-schedule');

const port = new serialport('/dev/ttyUSB0', 9600);

/* seconds minutes, hours, day-of-month month day-of-week */
/* this runs an event every 15 seconds */
var event = schedule.scheduleJob('*/15 * * * * *', function(){
  console.log('Running scheduled job');
  port.write('2');
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
