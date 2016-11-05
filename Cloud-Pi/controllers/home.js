/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home.html');
  console.log('Hey! Mind your own buisness!');
};

exports.postIndex = (req, res) => {
  console.log('There was a post from the index page!');
}
