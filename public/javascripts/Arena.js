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
    this.width = this.grid[0].length;
    this.height = this.grid.length;
    this.players = {}
};

Arena.prototype.update = function() {
  for (var i in this.players){
    this.updatePlayer(this.players[i]);
  }
};

Arena.prototype.isWalledAt = function(x,y) {
    return this.grid[y][x] === 3;
};

Arena.prototype.updatePlayer = function(player) {
  switch(player.direction) {
    case 'l':
      if (!this.isWalledAt(player.x-1, player.y)) {
        player.x--;
      }
      if (player.x < 0) { player.x = this.width;}
      break;
    case 'r':
      if (!this.isWalledAt(player.x+1, player.y)) {
        player.x++;
      }
      if (player.x >= this.width) { player.x = 0;}
      break;
    case 'u':
      if (!this.isWalledAt(player.x, player.y-1)) {
        player.y--;
      }
      if (player.y < 0) { player.y = this.height;}
      break;
    case 'd':
      if (!this.isWalledAt(player.x, player.y+1)) {
        player.y++;
      }
      if (player.y >= this.height) { player.y = 0;}
      break;
  }
  if (player.gobbler && this.grid[player.y][player.x] > 0) {
    console.log("nom!")
    this.grid[player.y][player.x] = 0;
  }
};

Arena.prototype.addPlayer = function(playerId,x,y) {
  var player = new Player(x,y, playerId % 4 == 0);
  this.players[playerId] = player;
  return player;
};

Arena.prototype.syncPlayer = function(playerId, x, y, direction, go) {
  var player = this.players[playerId];
  player.x = x;
  player.y = y;
  player.direction = direction;
};

Arena.prototype.removePlayer = function(playerId) {
  delete this.players[playerId];
};

Arena.prototype.draw = function(ctx) {
  var canvas = ctx.canvas;
    var w = canvas.width / this.width;
    var h = canvas.height / this.height;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            switch (this.grid[y][x]) {
                case 1:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(x * w + w/2, y * h + h/2, w/16 + h /16, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 2:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(x * w + w/2, y * h + h/2, w/8 + h /8, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 3:
                    ctx.fillStyle = "#00f";
                    ctx.fillRect(x * w, y * h, w, h);
                    break;
            }
        }
    }
    for (var i in this.players) {
      var player = this.players[i];
      var image = new Image();
      image.src = '/images/pacman.gif';
      ctx.drawImage(image, player.x * w, player.y * h);
    }
};

// end Arena
