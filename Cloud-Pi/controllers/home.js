
/* Module dependecies, this lets us spawn a child process */
const proc = require('child_process').spawn;

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home.html');
  console.log('Hey! Mind your own buisness!');
};

/*
  POST
  Home page.
*/
exports.postIndex = (req, res) => {
  console.log('Updating mode');
  console.log(req.body.mode.mode);
  res.render('home.html');
  var p = proc('python2.7', ['cloud.py', req.body.mode.mode]);

  p.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
   });

  p.on('close', (code) => {
    console.log('Exited with code: ' + code);
  });

}
