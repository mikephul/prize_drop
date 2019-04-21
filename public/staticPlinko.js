function StaticPlinko(x, y, r) {
  var options = {
    restitution: 1,
    friction: 0,
    isStatic: true
  };
  this.body = Bodies.circle(x, y, r, options);
  this.body.label = "staticPlinko";
  this.r = r;
  World.add(world, this.body);
}

StaticPlinko.prototype.show = function() {
  fill(127);
  noStroke();
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.r * 2);
  pop();
};