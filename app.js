// http://www.gianlucaguarini.com/blog/nodejs-and-a-simple-push-notification-server/

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  parser = new require('xml2json'),
  fs = require('fs');

app.listen(8000);

console.log('server listening on localhost:8000');

// on server started we can load our client.html page
function handler(req, res) {
  var url = req.url === '/' ? 'index.html': req.url;
  console.log(url);
  fs.readFile(__dirname + '/public/' + url, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading  ' + req.url +": " + err);
    }
    res.writeHead(200);
    res.end(data);
  });
}

eval(fs.readFileSync('public/javascripts/Player.js').toString());
eval(fs.readFileSync('public/javascripts/Arena.js').toString());

var arena = new Arena();
var maxPlayerId = 0;

function getPosition(playerId, type) {
  var gobbler = type === 0;
  var n = playerId % 3;
  return {
    x: {true: [5, 11, 17][n], false: 11}[gobbler] * arena.gridSpacing,
    y: {true: [1, 17, 1][n], false: 11}[gobbler] * arena.gridSpacing
  };
}

io.sockets.on('connection', function(socket) {

  var type = arena.bestType();
  var playerId = maxPlayerId;
  var pos = getPosition(playerId, type);
  var player = arena.addPlayer(playerId, pos.x, pos.y, type);

  socket.emit("syncArena", arena);

  socket.on('disconnect', function() {
    arena.removePlayer(playerId);
    io.emit('playerRemoved', {"playerId": playerId});
    if (!arena.hasPlayers()) {
      maxPlayerId = 0;
    }
  })
  io.emit('playerAdded', {"playerId": playerId, "x": player.x, "y": player.y, "type": player.type});

  socket.on('changePlayerDirection', function(e) {
      var player = arena.players[playerId];
      player.nextDirection = e.nextDirection;
      io.emit('syncPlayer', {"playerId": playerId, "direction": player.direction,
        "nextDirection": e.nextDirection, "x": player.x, "y": player.y});
  });

  maxPlayerId++;
});

function redirectImmobilePlayers() {
  for (var playerId in arena.players) {
    var player = arena.players[playerId];
    if (player.timeUntilForceMove == undefined) {
      player.timeUntilForceMove = 10;
    }

    if (!arena.playerCanMove(player, player.direction)) {
      if (player.timeUntilForceMove <= 0) {
        player.nextDirection = "udlr".charAt(parseInt(Math.random() * 4));
        io.emit('syncPlayer', {"playerId": playerId, "direction": player.direction,
          "nextDirection": player.nextDirection, "x": player.x, "y": player.y});
      } else {
        player.timeUntilForceMove--;
      }
    } else {
      player.timeUntilForceMove = 10;
    }
  }
}

function slaughter() {
  var gobblerVulnerable = arena.pillTimeLeft <= 0;
  for (var murderePlayerId in arena.players) {
    var murderer = arena.players[murderePlayerId];
    var murdererGobler = murderer.type === 0;
    if (murdererGobler && !gobblerVulnerable || !murdererGobler && gobblerVulnerable) {
      for (var playerId in arena.players) {
        var victim = arena.players[playerId];
        var victimGobbler = victim.type === 0;

        if (murdererGobler !== victimGobbler && murderer.x === victim.x && murderer.y === victim.y) {
          var pos = getPosition(parseInt(Math.random() * 3), victim.type);

          murderer.score += murdererGobler ? 100 : 1000;
          victim.alive = false;
          victim.x = pos.x;
          victim.y = pos.y;

          io.emit("playerKilled", {"playerId": playerId, "x": victim.x, "y": victim.y});
          io.emit("scoreChanged", {"playerId": murderePlayerId, "score": murderer.score});
        }
      }
    }
  }
}

var run = (function() {
  var fps = 60, loops = 0, skipTicks = 1000 / fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

  return function() {
    loops = 0;

    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
      arena.update();
      redirectImmobilePlayers();
      slaughter();

      nextGameTick += skipTicks;
      loops++;
    }

  };
})();

setInterval(run, 0);
