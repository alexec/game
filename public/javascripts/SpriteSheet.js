function SpriteSheet(gridSpacing) {
  this.image = new Image();
  this.image.src = '/images/sprite-sheet.gif';
  this.gridSpacing = gridSpacing;
}


SpriteSheet.prototype.drawPlayer = function(ctx, vulnerable, player, x, y) {

  var pos = this.getPosition(vulnerable, player);
  var d = this.gridSpacing;

  ctx.drawImage(this.image, pos.x * d, pos.y * d, d, d, x, y, d, d);
}

SpriteSheet.prototype.getPosition = function(vulnerable, player) {

  var vulnerable = vulnerable && player.type > 0;
  var numFrames = player.type === 0 ? 3 : 2;
  var frame = (player.x + player.y) % numFrames;
  var origin = vulnerable ? 12 : {0: 0, 1: 16, 2: 24, 3: 32, 4: 40}[player.type];
  var offset = vulnerable ? 0 : Math.max('udlr'.indexOf(player.direction) * numFrames, 0);
  var i = origin + offset + frame;
  var x = i % 8;
  var y = parseInt(i / 8);

  return {x: x, y: y};
}
