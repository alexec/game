var Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };

  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

  var Game = {
    fps: 60,
    width: 32 * 20,
    height: 32 * 16
  };

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
    Game.canvas = document.createElement("canvas");
    Game.canvas.width = Game.width;
    Game.canvas.height = Game.height;

    Game.context = Game.canvas.getContext("2d");

    document.body.appendChild(Game.canvas);

    Game.player = new Player();

    Game._onEachFrame(Game.run);
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
    Game.context.clearRect(0, 0, Game.width, Game.height);
    Game.player.draw(Game.context);
  };

  Game.update = function() {
    Game.player.update();
  };

  function Player() {
    this.x = 0;
    this.y = 0;
    this.speed = 4;
    this.move = 'Right';
    this.image = new Image();
    this.image.src = '/images/pacman.gif';
  }

  Player.prototype.draw = function(context) {
    context.drawImage(this.image, this.x, this.y);
  };

  Player.prototype.moveLeft = function() {
    this.x = this.x < -32 ? Game.width : this.x - this.speed;
  };

  Player.prototype.moveRight = function() {
    this.x = this.x > Game.width ? - 32 : this.x + this.speed;
  };

  Player.prototype.moveUp = function() {
    this.y = this.y < -32 ? Game.height : this.y - this.speed;
  };

  Player.prototype.moveDown = function() {
    this.y = this.y > Game.height ? -32 : this.y + this.speed;
  };

  Player.prototype.update = function() {
    if (Key.isDown(Key.UP)) this.nextMove = 'Up';
    if (Key.isDown(Key.LEFT)) this.nextMove = 'Left';
    if (Key.isDown(Key.DOWN)) this.nextMove = 'Down';
    if (Key.isDown(Key.RIGHT)) this.nextMove = 'Right';

    if (this.x % 32 == 0 && this.y % 32 == 0 && this.nextMove) {
      this.move = this.nextMove ? this.nextMove : this.move;
      this.nextMove = null;
    }

    this["move" + this.move]();
  };

$(function() {
  Game.start()
})
