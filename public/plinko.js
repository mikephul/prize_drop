function Plinko(x, y) {
  var options = {
    isStatic: true
  };
  this.w = 120;
  this.h = 10;
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
