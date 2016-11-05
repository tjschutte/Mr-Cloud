/**
 * Module dependencies.
 */
const express = require('express');

/*
 * Some serialport initialization stuff first
 */
var serialport = require('serialport'),// include the library
SerialPort = serialport.SerialPort,    // make a local instance of it
portName = '/dev/tty0';

var data = '2\n';                          // latest data
var servi = require('servi');          // include the servi library
var myPort = new SerialPort(portName, {
  baudRate: 9600
});

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');


/**
 * Create Express server.
 */
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.post('/', homeController.postIndex);
app.route('/data', sendToSerial);

function sendToSerial(data) {
  console.log("sending to serial: " + data);
  myPort.write(data);
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
