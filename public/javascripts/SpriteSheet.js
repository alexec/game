function SpriteSheet(image) {
  this.image = new Image();
  this.image.src = '/images/sprite-sheet.gif';
}

SpriteSheet.prototype.drawPlayer = function(ctx, arena, player) {

  var numFrames = player.type === 0 ? 3 : 2;
  var frame = (player.x + player.y) % numFrames;
  var vulnerable = arena.pillTimeLeft > 0 && player.type > 0;
  var origin = vulnerable ? 12 : {0: 0, 1: 16, 2: 24, 3: 32, 4: 40}[player.type];
  var offset = vulnerable ? 0 : Math.max('udlr'.indexOf(player.direction) * numFrames, 0);
  var i = origin + offset + frame;
  var x = i % 8;
  var y = parseInt(i / 8);
  var d = arena.gridSpacing;

  //console.log("i=" + i + " numFrames=" + numFrames);
  var frame = parseInt((player.x + player.y) / 2) % 2;
  ctx.drawImage(this.image, x * d, y * d, d, d, player.x, player.y, d, d);
}
