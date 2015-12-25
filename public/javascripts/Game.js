Game = {
  fps: 60
}

Game._onEachFrame = (function() {
  var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

  if (requestAnimationFrame) {
   return function(cb) {
      var _cb = function() { cb(); requestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    return function(cb) {
      setInterval(cb, 1000 / Game.fps);
    }
  }
})();

Game.start = function(canvas) {

  // creating a new websocket
  this.socket = io.connect('http://localhost:8000');

  this.arena = new Arena();
  this.spriteSheet = new SpriteSheet(this.arena.gridSpacing);
  this.scoreChart = new ScoreChart(this.arena.width, 200, this.arena.height, this.spriteSheet);

  // on every message recived we print the new datas inside the #container div
  canvas.width = this.arena.width + this.scoreChart.width;
  canvas.height = this.arena.height;

  Game.context = canvas.getContext("2d");
  Game._onEachFrame(Game.run);

  window.addEventListener('keydown', function(e) {
    var nextDirection =
      e.keyCode == Key.LEFT ? 'l':
      e.keyCode == Key.RIGHT ? 'r':
      e.keyCode == Key.UP ? 'u':
      'd';

      Game.socket.emit("changePlayerDirection", {"nextDirection": nextDirection});
  }, false);

  this.socket.on('syncArena', function(e) {
    Game.arena.grid = e.grid;
    Game.arena.players = e.players;
  });
  this.socket.on('gridChanged', function(e) {
    Game.arena.setGrid(e.x, e.y, e.value);
  });
  this.socket.on('playerAdded', function(e) {
    Game.arena.addPlayer(e.playerId, e.x, e.y, e.type);
  });
  this.socket.on('playerRemoved', function(e) {
    Game.arena.removePlayer(e.playerId);
  });
  this.socket.on('syncPlayer', function(e) {
    Game.arena.syncPlayer(e.playerId, e.x, e.y, e.direction, e.nextDirection);
  });
  this.socket.on('playerKilled', function(e) {
    Game.arena.killPlayer(e.playerId, e.x, e.y);
  });
  this.socket.on('scoreChanged', function(e) {
    Game.arena.setPlayerScore(e.playerId, e.score);
  });
};

Game.run = (function() {
  var loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime(),
      lastGameTick;

  return function() {
    loops = 0;

    while ((new Date).getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    if (loops) Game.draw();
  }
})();

Game.draw = function() {
  this.arena.draw(Game.context, this.spriteSheet);
  this.scoreChart.draw(Game.context, this.arena.players);
};
Game.update = function() {
  this.arena.update();
};
