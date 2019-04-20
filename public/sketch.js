// // ITP Networked Media, Fall 2014
// // https://github.com/shiffman/itp-networked-media
// // Daniel Shiffman

// // Keep track of our socket connection
// var socket;
// https://codepen.io/jelito/pen/KWWENp
var Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var plinkos = [];
var boundaries = [];
var cols = 10;
var rows = 10;

// var ding;

// function preload() {
//   ding = loadSound("subway.mp3");
// }

// function mousePressed() {
//   ding.play();
// }

function setup() {
  createCanvas(600, 800);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 2;

  function collision(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if (
        (labelA == "particle" && labelB == "plinko") ||
        (labelA == "plinko" && labelB == "particle")
      ) {
        console.log("collide!");
      }
    }
  }
  Events.on(engine, "collisionStart", collision);

  newParticle();
  var spacing = width / cols;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = spacing + i * spacing;
      plinkos.push(new Plinko(x, y, 16));
    }
  }

  var b = new Boundary(width / 2, height + 50, width, 100);
  boundaries.push(b);

  for (var i = 0; i < cols + 2; i++) {
    var x = i * spacing;
    var h = 100;
    var w = 10;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    boundaries.push(b);
  }
}

function newParticle() {
  var p = new Particle(300, 0, 10);
  particles.push(p);
}

function draw() {
  if (frameCount % 300 == 0) {
    newParticle();
  }
  background(51);
  Engine.update(engine);
  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
      i--;
    }
  }
  plinkos.map(p => p.show());
  boundaries.map(b => b.show());
  //   ellipse(mouseX, mouseY, 60, 60);
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
