function Text(label, x, y) {
  this.label = label;
  this.x = x;
  this.y = y;
}

Text.prototype.show = function() {
  fill(255);
  noStroke();
  push();
  textSize(16);
  textAlign(LEFT, CENTER);
  translate(this.x, this.y);
  rotate(-PI/2);
  text(this.label, 0,0);
  pop();
}