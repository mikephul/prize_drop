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

var cols = 8;
var rows = 3;

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
  var canvasWidth = 1500;
  var canvasHeight = 800;
  createCanvas(canvasWidth, canvasHeight);

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0.3;
  var wallOption = {
    restitution: 0,
    density: 0,
    friction: 1,
    isStatic: true
  };
  var offset = 50;
  World.add(world, [
    // wall
    Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, offset, wallOption),
    Bodies.rectangle(canvasWidth, canvasHeight / 2, offset, canvasHeight, wallOption),
    Bodies.rectangle(0, canvasHeight / 2, offset, canvasHeight, wallOption),
    Bodies.rectangle(canvasWidth / 2, canvasHeight + (offset/2), canvasWidth, offset, wallOption)
  ]);

  // socket
  socket = io.connect('http://localhost:3000');
  socket.on('stateOfAnglesChanged',
    // When we receive data
    function(data) {
      data.map((angle, elementIndex) => {
        Body.setAngle(plinkos[elementIndex].body, angle);
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
      
      // set button next
      var node = document.createElement("BUTTON");
      document.body.appendChild(node);
      node.className = 'arrow arrow-right';
      node.style.top = (y - 25) + 'px';
      node.style.left = x + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotateNext;
      // set button next

      // set button next
      var node = document.createElement("BUTTON");
      document.body.appendChild(node);
      node.className = 'arrow arrow-left';
      node.style.top = (y - 25) + 'px';
      node.style.left = x - 50 + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotatePre;
      // set button next
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

function rotateNext() {
  var elementIndex = this.getAttribute('data-element-id');
  var angle = Math.PI / 10;
  var stateOfAngles = [];
  plinkos.map(({ body }) => {
    stateOfAngles.push(body.angle);
  });
  stateOfAngles[elementIndex] += angle;
  socket.emit("stateOfAnglesChanged", stateOfAngles);
  Body.setAngle(plinkos[elementIndex].body, stateOfAngles[elementIndex]);
}

function rotatePre() {
  var elementIndex = this.getAttribute('data-element-id');
  var angle = Math.PI / 10;
  var stateOfAngles = [];
  plinkos.map(({ body }) => {
    stateOfAngles.push(body.angle);
  });
  stateOfAngles[elementIndex] -= angle;
  socket.emit("stateOfAnglesChanged", stateOfAngles);
  Body.setAngle(plinkos[elementIndex].body, stateOfAngles[elementIndex]);
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
