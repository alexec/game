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

io.sockets.on('connection', function(socket) {
  var playerId = maxPlayerId;
  var player = arena.addPlayer(playerId, 1, 1);

  socket.on('disconnect', function() {
    arena.removePlayer(playerId);
  })

  socket.emit('playerAdded', {"playerId": playerId, "x": player.x, "y": player.y, "gobbler": player.gobbler});

  socket.on('changePlayerDirection', function(e) {
      var player = arena.players[playerId];
      player.direction = e.direction;
      socket.emit('syncPlayer', {"playerId": playerId, "direction": e.direction, "x": player.x, "y": player.y});
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
