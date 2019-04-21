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
var staticPlinkos = [];
var boundaries = [];
var texts = [];

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
  var canvasHeight = 2400;
  createCanvas(canvasWidth, canvasHeight);

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1;
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
  socket = io.connect();
  socket.on('stateOfAnglesChanged',
    // When we receive data
    function(data) {
      Body.setAngle(plinkos[data.elementIndex].body, data.angle);
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

  // newParticle();

  // dynamic plinko lv1
  var spacing = width / cols;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = spacing + i * spacing;
      plinkos.push(new Plinko(x, y, 6));
      
      // set button rotate right
      var node = document.createElement("BUTTON");
      document.getElementById('button-box').appendChild(node);
      node.className = 'arrow arrow-right';
      node.style.top = (y - 25) + 'px';
      node.style.left = x + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotateNext;

      // set button rotate left
      var node = document.createElement("BUTTON");
      document.getElementById('button-box').appendChild(node);
      node.className = 'arrow arrow-left';
      node.style.top = (y - 25) + 'px';
      node.style.left = x - 50 + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotatePre;
    }
  }

  // static plinko lv1
  var colsOfStaticPlinko = 35;
  var rowsOfStaticPlinko = 8;
  var spacing = width / colsOfStaticPlinko;
  for (var i = 0; i < rowsOfStaticPlinko; i++) {
    for (var j = 0; j < colsOfStaticPlinko + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = (spacing + i * spacing) + 750;
      staticPlinkos.push(new StaticPlinko(x, y, 8));
    }
  }

  // dynamic plinko lv2
  spacing = width / cols;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = (spacing + i * spacing) + 1100;
      plinkos.push(new Plinko(x, y, 6));
      
      // set button rotate right
      var node = document.createElement("BUTTON");
      document.getElementById('button-box').appendChild(node);
      node.className = 'arrow arrow-right';
      node.style.top = (y - 25) + 'px';
      node.style.left = x + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotateNext;

      // set button rotate left
      var node = document.createElement("BUTTON");
      document.getElementById('button-box').appendChild(node);
      node.className = 'arrow arrow-left';
      node.style.top = (y - 25) + 'px';
      node.style.left = x - 50 + 'px';
      node.setAttribute('data-element-id', plinkos.length - 1);
      node.onclick = rotatePre;
    }
  }

  // static plinko lv3
  colsOfStaticPlinko = 40;
  rowsOfStaticPlinko = 8;
  var spacing = width / colsOfStaticPlinko;
  for (var i = 0; i < rowsOfStaticPlinko; i++) {
    for (var j = 0; j < colsOfStaticPlinko + 1; j++) {
      var x = j * spacing;
      if (i % 2 == 1) {
        x += spacing / 2;
      }
      var y = (spacing + i * spacing) + 1820;
      staticPlinkos.push(new StaticPlinko(x, y, 8));
    }
  }

  // init all angles
  shareStateOfAngles.map((angle, elementIndex) => {
    Body.set(plinkos[elementIndex].body, 'angle', angle);
  });

  // Floor
  var floor = new Boundary(width / 2, height + 50, width, 100);
  boundaries.push(floor);

  // init buckets
  setBucket(shareStateOfBuckets);
}

function setBucket(array) {
  var num_buckets = array.length;
  for (var i = 0; i < num_buckets; i++) {
    var x = (i * width) / num_buckets;
    var h = 100;
    var w = 5;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    texts.push(new Text(shareStateOfBuckets[i], x + 12, y + h/2))
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
  socket.emit("stateOfAnglesChanged", { elementIndex, angle: stateOfAngles[elementIndex] });
  Body.setAngle(plinkos[elementIndex].body, stateOfAngles[elementIndex] || 0);
}

function rotatePre() {
  var elementIndex = this.getAttribute('data-element-id');
  var angle = Math.PI / 10;
  var stateOfAngles = [];
  plinkos.map(({ body }) => {
    stateOfAngles.push(body.angle);
  });
  stateOfAngles[elementIndex] -= angle;
  socket.emit("stateOfAnglesChanged", { elementIndex, angle: stateOfAngles[elementIndex] });
  Body.setAngle(plinkos[elementIndex].body, stateOfAngles[elementIndex] || 0);
}

function newParticle(x) {
  if (x < 100) x = 100;
  if (x > 1400) x = 1400;
  var p = new Particle(x, 10, 10);
  particles.push(p);
}

function draw() {
  // if (frameCount % 300 == 0) {
  //   newParticle();
  // }
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
  staticPlinkos.map(p => p.show());
  boundaries.map(b => b.show());  
  
  texts.map(t => t.show());  
  // console.log(texts)
}
