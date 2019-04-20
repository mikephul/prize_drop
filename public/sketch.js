// // ITP Networked Media, Fall 2014
// // https://github.com/shiffman/itp-networked-media
// // Daniel Shiffman

// // Keep track of our socket connection
// var socket;
// https://codepen.io/jelito/pen/KWWENp
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var plinkos = [];
var bounds = [];
var cols = 10;
var rows = 10;

function setup() {
  createCanvas(600, 800);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0.1;
  newParticle();
  var spacing = width / cols;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = spacing + i * spacing;
      plinkos.push(new Plinko(x, y, 4));
    }
  }

  var b = new Boundary(width / 2, height + 50, width, height);
}

function newParticle() {
  var p = new Particle(20, 0, 10);
  particles.push(p);
}

function draw() {
  if (frameCount % 60 == 0) {
    newParticle();
  }
  background(51);
  Engine.update(engine);
  particles.map(p => p.show());
  plinkos.map(p => p.show());
  ellipse(mouseX, mouseY, 60, 60);
}

// function mouseDragged() {
//   // Draw some white circles
//   fill(255);
//   noStroke();
//   ellipse(mouseX, mouseY, 20, 20);
//   // Send the mouse coordinates
//   sendmouse(mouseX, mouseY);
// }

// // Function for sending to the socket
// function sendmouse(xpos, ypos) {
//   // We are sending!
//   console.log("sendmouse: " + xpos + " " + ypos);

//   // Make a little object with  and y
//   var data = {
//     x: xpos,
//     y: ypos
//   };

//   // Send that object to the socket
//   socket.emit("mouse", data);
// }
