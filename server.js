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
var shareStateOfBuckets = [
  "Keyboard",
  "Mouse",
  "Desk Mat",
  "Desk Mat",
  "Desk Mat",
  "Whiteboard",
  "Whiteboard",
  "Mug",
  "Mug",
  "LCD Board",
  "LCD Board",
  "Martin Ticket",
  "GCP Credit",
  "A4 Box",
  "Paper Cat",
  "Paper Cat",
  "yourname.dev",
  "Enter Key",
  "Punching ball",
  "Laptop desk",
  "Laptop desk",
  "Node Lite",
  "Node Lite",
  "Node Lite",
  "Raspberry PI",
  "DOY Google Home"
];

shareStateOfBuckets = shuffle(shareStateOfBuckets);

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

app.use(express.static("public"));

app.get('/', function(req, res) {
  res.render('index', { shareStateOfAngles: shareStateOfAngles, shareStateOfBuckets: shareStateOfBuckets });
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
