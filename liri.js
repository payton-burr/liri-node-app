require('dotenv').config();

let moment = require('moment');
let axios = require('axios');
let keys = require('./keys.js');
let Spotify = require('node-spotify-api');
let fs = require('fs');

let search = process.argv[2];

let term = process.argv.slice(3).join(' ');

let Concert = function() {
  // let divider = '\n---------------------------------------------------\n\n';

  this.findConcert = function(artist) {
    let URL =
      'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp';

    axios.get(URL).then(function(response) {
      let result = response.data;

      console.log('Upcoming concerts for ' + artist + ':');
      for (let i = 0; i < result.length; i++) {
        console.log('\n---------------------------------------------------\n');
        console.log(result[i].venue.city);
        console.log(result[i].venue.country || result[i].venue.region);
        console.log(result[i].venue.name);
        console.log(moment(result[i].datetime).format('MM/DD/YYYY'));
        console.log('\n---------------------------------------------------');
      }
    });
  };
};

let Movie = function() {
  this.findMovie = function(movie) {
    let URL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy';

    axios.get(URL).then(function(response) {
      let result = response.data;
      console.log(URL);
      console.log('\n---------------------------------------------------\n');
      console.log('Title: ' + result.Title);
      console.log('Release Year: ' + result.Year);
      console.log('IMDB Rating: ' + result.imdbRating);
      console.log('Rotten Tomatoes Rating: ' + result.Ratings[1].Value);
      console.log('Country Movie Was Produced: ' + result.Country);
      console.log('Languages: ' + result.Language + '\n');
      console.log('Movie Plot:\n' + result.Plot + '\n');
      console.log('Cast:\n' + result.Actors);
      console.log('\n---------------------------------------------------\n');
    });
  };
};
let spotify = new Spotify(keys.spotify);

let Song = function() {
  let artistName = function(artist) {
    return artist.name;
  };

  this.findSong = function(song) {
    spotify.search(
      {
        type: 'track',
        query: song
      },
      function(error, data) {
        if (error) {
          console.log('Error: ' + error);
        }
        let songs = data.tracks.items;

        for (let i = 0; i < songs.length; i++) {
          console.log(i + '\n');
          console.log('Artist/s: ' + songs[i].artists.map(artistName) + '\n');
          console.log('Song: ' + songs[i].name + '\n');
          console.log('Preview: ' + songs[i].preview_url);
          console.log('Album: ' + songs[i].album.name + '\n');
          console.log('-----------------------------------');
        }
      }
    );
  };
};

let concert = new Concert();
let movie = new Movie();
let song = new Song();

switch (search) {
  case 'concert-this':
    console.log('SEARCHING CONCERT\n');
    concert.findConcert(term);
    break;
  case 'spotify-this-song':
    console.log('SEARCHING SPOTIFY');
    if (!term) {
      term = 'The Sign by Ace of Base';
    }
    song.findSong(term);
    break;
  case 'movie-this':
    console.log('SEARCHING MOVIE');
    if (!term) {
      term = 'Mr Nobody';
    }
    movie.findMovie(term);
    break;
  case 'do-what-it-says':
    fs.readFile('random.txt', 'utf8', function(error, data) {
      if (error) throw error;
      let arr = data.split(',');
      songname = arr[1];
      if (!term) {
        term = songname;
      }
      song.findSong(term);
    });
}
