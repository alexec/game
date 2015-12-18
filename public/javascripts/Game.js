Game = {
  fps: 60,
  width: 23 * 32,
  height: 23 * 32
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

Game.start = function() {

  // creating a new websocket
  this.socket = io.connect('http://localhost:8000');
  // on every message recived we print the new datas inside the #container div
  var canvas = document.createElement("canvas");
  canvas.width = Game.width;
  canvas.height = Game.height;
  document.body.appendChild(canvas);

  Game.context = canvas.getContext("2d");

  Game.arena = new Arena();

  console.log(Game.arena);

  Game._onEachFrame(Game.run);

  window.addEventListener('keydown', function(e) {
    var direction =
      e.keyCode == Key.LEFT ? 'l':
      e.keyCode == Key.RIGHT ? 'r':
      e.keyCode == Key.UP ? 'u':
      'd';

      Game.socket.emit("changePlayerDirection", {"direction": direction})
  }, false);

  this.socket.on('syncArena', function(e) {
    Game.arena.grid = e.grid;
    Game.arena.players = e.players;
  });
  this.socket.on('playerAdded', function(e) {
    Game.arena.addPlayer(e.playerId, e.x, e.y);
  });
  this.socket.on('playerRemoved', function(e) {
    Game.arena.removePlayer(e.playerId);
  });
  this.socket.on('syncPlayer', function(e) {
    Game.arena.syncPlayer(e.playerId, e.x, e.y, e.direction);
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
  this.arena.draw(Game.context);
};

Game.update = function() {
  this.arena.update();
};

var spriteSheet = new Image();
spriteSheet.src = '/images/sprite-sheet.gif';
