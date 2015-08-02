var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.SPOTIFY_DB);
var unirest = require('unirest');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/visualize');
});

router.get('/visualize', function (req, res, next) {
  res.render('show', {title: 'SONGZ YO'});
});

// router.get('/visualize/api/:albumId', function (req, res) {
//     unirest.get('https://api.spotify.com/v1/albums/' + req.params.albumId)
//     // .header("X-Mashape-Key", process.env.MASH_KEY)
//     .end(function (result) {
//       res.json(result);
//   });
// });

router.get('/visualize/song/:songUrl', function (req, res) {
  unirest.get('https://p.scdn.co/mp3-preview/' + req.params.songUrl)
  .end(function (result) {
    // console.log(result.raw_body);
    fs.writeFile('public/music/song.mp3', result.raw_body, function (err) {
      if (err) throw err;
        res.json('It\'s saved!');
    });
  });
});

module.exports = router;
