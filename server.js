// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require("express");
var path = require('path');
// Create the app
var app = express();
app.set('views', path.resolve('public'));
app.set('view engine', 'ejs');

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://" + host + ":" + port);
}

var shareStateOfAngles = [];

app.use(express.static("public"));

app.get('/', function(req, res) {
  res.render('index', { shareStateOfAngles: shareStateOfAngles });
});

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require("socket.io")(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects


io.sockets.on(
  "connection",
  // We are given a websocket object in our function
  function(socket) {
    console.log("We have a new client: " + socket.id);
    
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on("stateOfAnglesChanged", function(data) {
      shareStateOfAngles[data.elementIndex] = data.angle;
      socket.broadcast.emit("stateOfAnglesChanged", data);

      // This is a way to send to everyone including sender
      // io.sockets.emit('message', "this goes to everyone");
    });

    socket.on("disconnect", function() {
      console.log("Client has disconnected");
    });
  }
);
