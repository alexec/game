// start Arena

function Arena() {
    var _ = 0, P = 2, w = 3;
    this.grid = [
        [w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w],
        [w,1,1,1,1,1,1,1,1,1,1,w,1,1,1,1,1,1,1,1,1,1,w],
        [w,1,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,P,w,_,w,1,w,_,_,w,1,w,1,w,_,_,w,1,w,_,w,P,w],
        [w,1,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,1,1,1,1,1,1,1,1,1,1,P,1,1,1,1,1,1,1,1,1,1,w],
        [w,1,w,w,w,1,w,1,w,w,w,w,w,w,w,1,w,1,w,w,w,1,w],
        [w,1,1,1,1,1,w,1,1,1,1,w,1,1,1,1,w,1,1,1,1,1,w],
        [w,w,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,w,w],
        [_,_,_,_,w,1,w,_,_,_,_,_,_,_,_,_,w,1,w,_,_,_,_],
        [w,w,w,w,w,1,w,_,w,w,w,_,w,w,w,_,w,1,w,w,w,w,w],
        [_,_,_,_,_,1,_,_,w,_,_,_,_,_,w,_,_,1,_,_,_,_,_],
        [w,w,w,w,w,1,w,_,w,w,w,w,w,w,w,_,w,1,w,w,w,w,w],
        [_,_,_,_,w,1,w,_,_,_,_,_,_,_,_,_,w,1,w,_,_,_,_],
        [w,w,w,w,w,1,w,_,w,w,w,w,w,w,w,_,w,1,w,w,w,w,w],
        [w,1,1,1,1,1,1,1,1,1,1,w,1,1,1,1,1,1,1,1,1,1,w],
        [w,1,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,P,1,1,w,1,1,1,1,1,1,1,1,1,1,1,1,1,w,1,1,P,w],
        [w,w,w,1,w,1,w,1,w,w,w,w,w,w,w,1,w,1,w,1,w,w,w],
        [w,1,1,1,1,1,w,1,1,1,1,w,1,1,1,1,w,1,1,1,1,1,w],
        [w,1,w,w,w,w,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,1,1,1,1,1,1,1,1,1,1,P,1,1,1,1,1,1,1,1,1,1,w],
        [w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w],
    ];
    this.gridSpacing = 32;
    this.speed = 2;
    this.width = this.grid[0].length * this.gridSpacing;
    this.height = this.grid.length * this.gridSpacing;
    this.players = {};
    this.pillTimeLeft = 0;
};
Arena.prototype.hasPlayers = function() {
  for (var playerId in this.players) {
    return true;
  }
  return false;
};

Arena.prototype.update = function() {
  for (var playerId in this.players){
    this.updatePlayer(this.players[playerId]);
  }
  this.pillTimeLeft = Math.max(0, this.pillTimeLeft - 1);
};

Arena.prototype.isWalledAt = function(x,y) {
    return this.getGrid(x,y) === 3;
};

Arena.prototype.getGrid = function(x,y) {
    return this.grid[this.getGridY(y)][this.getGridX(x)];
};
Arena.prototype.getGridX = function(x) {
  return parseInt(x / this.gridSpacing);
};
Arena.prototype.getGridY = function(y) {
  return parseInt(y / this.gridSpacing);
};
Arena.prototype.setGrid = function(x,y,value) {
  var oldValue = this.getGrid(x, y);
  if (oldValue != value)  {
    if (oldValue == 2) {
      this.pillTimeLeft += 500 / this.speed;
    }
    this.grid[this.getGridY(y)][this.getGridX(x)] = value;
  }
};

Arena.prototype.updatePlayer = function(player) {
  if (player.x % this.gridSpacing === 0 && player.y % this.gridSpacing === 0) {
    if (player.type === 0 && this.getGrid(player.x, player.y) > 0) {
      this.setGrid(player.x, player.y, 0);
      player.score += 20;
    }
  }
  if (this.playerCanMove(player, player.direction)) {
    switch(player.direction) {
      case 'l':
        player.x -= this.speed;
        if (player.x < 0) { player.x = this.width;}
        break;
      case 'r':
        player.x += this.speed;
        if (player.x >= this.width) { player.x = 0;}
        break;
      case 'u':
        player.y -= this.speed;
        if (player.y < 0) { player.y = this.height;}
        break;
      case 'd':
        player.y += this.speed;
        if (player.y >= this.height) { player.y = 0;}
        break;
    }
  }
  if (player.x % this.gridSpacing === 0 && player.y % this.gridSpacing === 0 &&
    this.playerCanMove(player, player.nextDirection)) {
    player.direction = player.nextDirection;
  }
};

Arena.prototype.playerCanMove  = function(player, direction) {
  switch(direction) {
    case 'l':
      return !this.isWalledAt(player.x - this.speed, player.y);
    case 'r':
      return !this.isWalledAt(player.x + this.gridSpacing, player.y);
    case 'u':
      return !this.isWalledAt(player.x, player.y - this.speed);
    case 'd':
      return !this.isWalledAt(player.x, player.y + this.gridSpacing);
  }
};


Arena.prototype.addPlayer = function(playerId, x, y, type ) {

  console.log("addPlayer playerId=" + playerId + ", x=" + x + ", y=" + y, ", type=" + type);

  this.playerId = this.playerId || playerId;

  var player = new Player(x, y, type);
  this.players[playerId] = player;
  return player;
};

Arena.prototype.syncPlayer = function(playerId, x, y, direction, nextDirection) {
  console.log("syncPlayer playerId=" + playerId + ", x=" + x +", y=" + y + ", direction=" + direction + ", nextDirection=" + nextDirection);
  var player = this.players[playerId];
  player.x = x;
  player.y = y;
  player.direction = direction;
  player.nextDirection = nextDirection;
};

Arena.prototype.removePlayer = function(playerId) {
  console.log("removePlayer playerId=" + playerId);
  delete this.players[playerId];
};
Arena.prototype.killPlayer = function(playerId, x, y) {
  console.log("killPlayer playerId=" + playerId);
  var player = this.players[playerId];
  player.alive = false;
  player.x = x;
  player.y = y;
};

Arena.prototype.draw = function(ctx, spriteSheet) {
    var w = this.gridSpacing;
    var h = this.gridSpacing;

    ctx.clearRect(0,0,this.width, this.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,this.width, this.height);

    for (var x = 0; x < this.width; x += this.gridSpacing) {
        for (var y = 0; y < this.height; y += this.gridSpacing) {
            switch (this.getGrid(x,y)) {
                case 1:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(x  + w/2, y + h/2, w/16 + h /16, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 2:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(x + w/2, y + h/2, w/8 + h /8, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 3:
                    ctx.fillStyle = this.pillTimeLeft > 0 ? "#f00": "#00f";
                    ctx.fillRect(x, y, w, h);
                    break;
            }
        }
    }

    for (var playerId in this.players) {
      var player = this.players[playerId];
      spriteSheet.drawPlayer(ctx, this.pillTimeLeft > 0, player, player.x, player.y);
      if (playerId == this.playerId) {
        ctx.fillStyle = "#ff0";
        ctx.beginPath();
        ctx.moveTo(player.x + this.gridSpacing * 0.25, player.y - this.gridSpacing * 0.75);
        ctx.lineTo(player.x + this.gridSpacing * 0.75, player.y - this.gridSpacing * 0.75 );
        ctx.lineTo(player.x + this.gridSpacing / 2, player.y - this.gridSpacing * 0.25);
        ctx.fill();
      }
    }
};

Arena.prototype.setPlayerScore = function(playerId, score) {
  this.players[playerId].score = score;
}

Arena.prototype.bestType = function() {
  var typeCount = {0:0, 1:0, 2:0, 3:0, 4:0};
  for (var playerId in this.players) {
    typeCount[this.players[playerId].type]++;
  }
  console.log("typeCount=", typeCount);
  var bestType = 0;
  for (var type in typeCount) {
    if (typeCount[type] < typeCount[bestType]) {
      bestType = type;
    }
  }
  return bestType;
}
