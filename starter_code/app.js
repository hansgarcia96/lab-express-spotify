const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = '850141fe76244af3b5f84278cf616a70',
    clientSecret = '12f3e4cc6be24e4793f8b56ef4e7288e';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// the routes go here:

app.get('/', (req, res, next) => {
    res.render('homepage');
});

app.get('/artists', (req, res, next) => {

    console.log("This is the name, " ,req.query)

    spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
        res.render("artist", { data: data.body.artists.items });
        console.log("The received data from the API: ", data.body.artists.items[0]);
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })

})

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      console.log(data.body.items)
      res.render("albums", {albums: data.body.items});
    })
    .catch(err => console.log("Error while searching the albums"))
})

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      res.render("tracks", {tracks: data.body.items});
    })
    .catch(err => console.log("Error getting the tracks"))
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

