var input = document.getElementById('search');
var searchButton = document.getElementById('search-button');
var resultSection = document.getElementsByClassName('results');
var audio = document.getElementById('player');

searchButton.addEventListener('click', function () {
  resultSection[0].innerHTML = '';
  // search for artist based off of user input and get artist spotify id for api call
  var searchXhr = new XMLHttpRequest();
  searchXhr.open('GET', 'http://ws.spotify.com/search/1/artist.json?q=' + input.value, false);
  searchXhr.send(null);
  var parsedObj = JSON.parse(searchXhr.responseText);
  var artistId = parsedObj.artists[0].href;
  var artistName = parsedObj.artists[0].name;
  var artistIdParam = artistId.split(':')[2];
  //api call with artists information
  var apiXhr = new XMLHttpRequest();
  apiXhr.open('GET', 'https://api.spotify.com/v1/artists/' + artistIdParam + '/albums?album_type=album', false);
  apiXhr.send(null);
  var parsedApiObj = JSON.parse(apiXhr.responseText);
  // console.log(parsedApiObj);
  var coverArtArray = [];
  var albumIds = [];
  var apiUrls = [];
  for (var i = 0; i < parsedApiObj.items.length; i++) {
    coverArtArray.push(parsedApiObj.items[i].images[1].url);
    albumIds.push(parsedApiObj.items[i].id);
    apiUrls.push('https://api.spotify.com/v1/albums/' + parsedApiObj.items[i].id);
  }
  for (var i = 0; i < coverArtArray.length; i++) {
    var img = document.createElement('img');
    img.className = 'album';
    resultSection[0].appendChild(img);
    img.src = coverArtArray[i];
  }
  //click listener for albums
  //this section is broken needs to be fixed!!!!!!!!!!!!!!!
  var albumImages = document.getElementsByClassName('album');
  var albums = [];
  [].forEach.call(albumImages, function (album) {
    albums.push(album);
  });
  for (var i = 0; i < albums.length; i++) {
    // console.log(apiUrls);
    albums[i].addEventListener('click', function () {
      // console.log(apiUrls);
      // console.log(albumId);
      var albumId = albumIds[albums.indexOf(this)];
      var trackXhr = new XMLHttpRequest();
      // trackXhr.open('GET', '/visualize/api/' + albumId, false);
      trackXhr.open('GET', 'https://api.spotify.com/v1/albums/' + albumId, false);
      // trackXhr.setRequestHeader("Origin", 'https://i.scdn.co/image/8b6392caa83625135f0f53d6e2b0631bbe4c4c0b');
      trackXhr.send(null);
      var parsedTrackObj = JSON.parse(trackXhr.responseText);
      // console.log(parsedTrackObj.body);
      var audioSource = parsedTrackObj.tracks.items[0].preview_url;
      var newAudioSource = audioSource.split('https://p.scdn.co/mp3-preview/')[1];
      var soundXhr = new XMLHttpRequest();
      soundXhr.open('GET', '/visualize/song/' + newAudioSource, false);
      soundXhr.send(null);
      var parsedSong = JSON.parse(soundXhr.responseText);
      // console.log(parsedSong.body);
      // console.log(audioSource);
      audio.src = audioSource;
      audio.play();
    });
  }
});
