
function Player(x, y, gobbler) {
  this.x = x;
  this.y = y;
  this.direction = '';
  this.nextDirection = '';
  this.gobbler = gobbler;
  this.alive = true;
}

Player.number = 5;
