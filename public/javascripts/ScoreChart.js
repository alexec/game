function ScoreChart(left, width, height, spriteSheet) {
  this.left = left;
  this.top = 0;
  this.width = width;
  this.height = height;
  this.spriteSheet = spriteSheet;
}

ScoreChart.prototype.draw = function(ctx, players) {
  var headingHeight = 52;
  var scoreHeight = 32;
  var padding = 10;
  ctx.clearRect(this.left, 0, this.width, this.height);
  ctx.textAlign = "center";
  ctx.font = headingHeight + "px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Scores", this.left + this.width / 2, this.top + headingHeight);

  var i = 0;
  ctx.font = scoreHeight + "px Arial";
  for (var playerId in players) {
    var player = players[playerId];
    var top = this.top + headingHeight + (1+i) * scoreHeight + 10 ;

    var pos = this.spriteSheet.getPosition(false, player);
    this.spriteSheet.drawPlayer(ctx, false, player, this.left + padding, top - scoreHeight);

    ctx.textAlign = "left";
    ctx.fillText(playerId + "UP", this.left + padding + this.spriteSheet.gridSpacing  , top);

    ctx.textAlign = "right";
    ctx.fillText(player.score, this.left + this.width -padding  , top );
    i++;
  }
};
