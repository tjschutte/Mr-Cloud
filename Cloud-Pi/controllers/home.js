
/* Module dependecies, this lets us spawn a child process */
const proc = require('child_process').spawn;
const serialport = require('serialport');

var port = new serialport('/dev/ttyUSB0', 9600);
//port.open(); //called automagically

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home.html');
  console.log('GET: /index');
};

/*
  POST
  Home page.
*/
exports.postIndex = (req, res) => {
  console.log('POST: /index');
  console.log('Changing mode to: ' + req.body.mode.mode);
//var p = proc('python2.7', ['cloud.py', req.body.mode.mode]);
  port.write(req.body.mode.mode);
  res.render('home.html');
}
