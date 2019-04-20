function Plinko(x, y) {
  var options = {
    restitution: 0,
    density: 0,
    friction: 0,
    isStatic: true
  };
  this.w = 180;
  this.h = 20;
  this.body = Bodies.rectangle(x, y, this.w, this.h, options);
  World.add(world, this.body);
}

Plinko.prototype.show = function() {
  fill(127);
  noStroke();
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  rectMode(CENTER);
  rotate(this.body.angle);
  rect(0, 0, this.w, this.h);
  pop();
};
