// http://www.gianlucaguarini.com/blog/nodejs-and-a-simple-push-notification-server/

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  parser = new require('xml2json'),
  fs = require('fs');

// creating the server ( localhost:8000 )
app.listen(8000);

console.log('server listening on localhost:8000');

// on server started we can load our client.html page
function handler(req, res) {
  console.log(req.url);
  fs.readFile(__dirname + '/public/' + req.url, function(err, data) {
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
var sockets = {};

//arena.listener = function(event, data) {
//  io.emit(event, data);
//};

function bestType() {
  var typeCount = {0:0, 1:0, 2:0, 3:0, 4:0};
  for (var playerId in arena.players) {
    typeCount[arena.players[playerId].type]++;
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

io.sockets.on('connection', function(socket) {

  var type = bestType();
  var playerId = maxPlayerId;
  var gobbler = type === 0;
  var n = parseInt(Math.random() * 3);
  var x = {true: [5, 11, 17][n], false: 11}[gobbler] * arena.gridSpacing ;
  var y = {true: [1, 17, 1][n], false: 11}[gobbler] * arena.gridSpacing ;
  var player = arena.addPlayer(playerId, x, y, type);

  socket.emit("syncArena", arena);

  sockets[socket] = true;

  socket.on('disconnect', function() {
    arena.removePlayer(playerId);
    delete sockets[socket];
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

var run = (function() {
  var fps = 60, loops = 0, skipTicks = 1000 / fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

  return function() {
    loops = 0;

    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
      arena.update();
      nextGameTick += skipTicks;
      loops++;
    }

  };
})();

setInterval(run, 0);
