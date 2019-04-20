// // ITP Networked Media, Fall 2014
// // https://github.com/shiffman/itp-networked-media
// // Daniel Shiffman

// // Keep track of our socket connection
var socket;
// https://codepen.io/jelito/pen/KWWENp
var Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

var engine;
var world;
var particles = [];
var plinkos = [];
var boundaries = [];

var cols = 12;
var rows = 5;

// var ding;
var img;
function preload() {
  //   ding = loadSound("subway.mp3");
  img = loadImage("gopher_dance.gif");
}

// function mousePressed() {
//   ding.play();
// }

function setup() {
  createCanvas(1500, 800);

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1;

  // socket
  socket = io.connect('http://localhost:3000');
  socket.on('stateOfAnglesChanged',
    // When we receive data
    function(data) {
      data.map((angle, elementIndex) => {
        Body.set(plinkos[elementIndex].body, 'angle', angle);
      });
    }
  );

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
  //   Events.on(engine, "collisionStart", collision);

  Events.on(engine, "tick", function(event) {
    console.log(event);
    if (mouseConstraint.mouse.button == 0) {
      alert("what is clicked?");
    }
  });

  newParticle();
  var spacing = width / cols;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = spacing + i * spacing;
      plinkos.push(new Plinko(x, y, 6));
      
      // set button
      var node = document.createElement("BUTTON");
      document.body.appendChild(node);
      node.style.position = 'absolute';
      node.style.top = (y - 25) + 'px';
      node.style.left = (x - 25) + 'px';
      node.style.width = '50px';
      node.style.height = '50px';
      node.style.border = '1px solid red';
      node.style.background = 'transparent';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = function() {
        var elementIndex = this.getAttribute('data-element-id');
        var angle = Math.PI / 6;
        var stateOfAngles = [];
        plinkos.map(({ body }) => {
          stateOfAngles.push(body.angle);
        });
        stateOfAngles[elementIndex] += angle;
        socket.emit("stateOfAnglesChanged", stateOfAngles);
        Body.set(plinkos[elementIndex].body, 'angle', stateOfAngles[elementIndex]);
      }
      // set button
    }
  }

  // init all angles
  shareStateOfAngles.map((angle, elementIndex) => {
    Body.set(plinkos[elementIndex].body, 'angle', angle);
  });

  // Floor
  var floor = new Boundary(width / 2, height + 50, width, 100);
  boundaries.push(floor);
  var num_buckets = 5;
  for (var i = 0; i < num_buckets + 1; i++) {
    var x = (i * width) / num_buckets;
    var h = 100;
    var w = 5;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    boundaries.push(b);
  }
}

function newParticle() {
  var p = new Particle(width / 2, 0, 10);
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
  image(img, 0, 0);
  //   ellipse(mouseX, mouseY, 60, 60);
}
