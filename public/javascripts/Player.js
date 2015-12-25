
function Player(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.direction = '';
  this.nextDirection = '';
  this.alive = true;
  this.score = 0;
}

Player.number = 5;
