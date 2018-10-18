require("dotenv").config();
var keys = require('./keys');
        var request = require('request');
        var Spotify = require('node-spotify-api');
        var omdb = require('omdb');
        var bandsintown = require('bandsintown');
        var fs = require("fs");
        var moment = require("moment");
        var input = process.argv;
        var action = input[2];
        var inputs = input[3];

var spotify = new Spotify(keys.spotify);

switch (action) {
    case "concert-this":
    getMyBands();
        break;
    case "spotify-this-song":
        spotify(inputs);
        break;
    case "movie-this":
        movie(inputs);
        break;
    case "do-what-it-says":
        grabText();
        break
};
// Concert-this function

function concertThis (artist) {
 var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
 //for each event : Name of Venue, Venue Location, Date of Event (MM/DD/YYYY)
 request(query, function(err, res, body) {
  if (err) {
    console.log('Error: ' + err);
  }
  
  if (!err && res.statusCode === 200) {
   var data = JSON.parse(body);
   //Don't say anything if there are no results
   if (!data.length) {
    console.log('Sorry nothing found for ' + artist);
   } else {
     console.log('Upcoming Events for ' + artist);
     data.forEach(concert => {
       console.log("Venue: " + concert.venue.name);
       console.log("Location: " + concert.venue.latitude + " " + concert.venue.longitude);
       console.log(concert.venue.city + ' ' + concert.venue.region + ' ' + concert.venue.country);
       //format datetime to MM/DD/YYYY
       console.log('Date: ' + moment(concert.datetime).format('MM/DD/YYYY') + '\n');
     });
   }
  }
 });
}

function spotify(songName) {
    console.log(songName)
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });
    // Default song is 
    var song
    if (songName === "") {
        song = 'The Sign';
    } else {
        song = songName;
    }
    console.log({
        song
    })
    // Run the spotify package 
    spotify.search({
        type: 'track',
        query: song,
        limit: 10
    }, function (err, data) {
        //console.log({err, data}) 
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songInfo = data.tracks.items;
        for (var i = 0; i < songInfo.length; i++) {
            console.log("Artist(s): " + songInfo[i].artists[0].name);
            console.log("Song Name: " + songInfo[i].name);
            console.log("Preview Link: " + songInfo[i].preview_url);
            console.log("Album: " + songInfo[i].album.name);
        }
    })
}
//movie function
function movie(inputs) {
    // Default movie is Mr. Nobody
    if (!inputs) {
        inputs = 'Mr Nobody';
    }
    // URL for the request module
    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=aa15144d";
    //console.log(queryUrl);
    // Return the data when there is no error and the request was successful
    request(queryUrl, function (error, response, body) {
        // Return the data when there is no error
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    })
}
function grabText() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr[0] === "spotify-this-song") {
            var song = dataArr[1].slice(1, -1);
            spotify(song);
        } else if (dataArr[0] === "movie-this") {
            var movieName = dataArr[1].slice(1, -1);
            movie(movieName);
        } else if (dataArr[0] === "concert-this") {
            var bandsName = dataArr[1].slice(1, -1);
            bandsintown(bandsName);
        }
    });
};
