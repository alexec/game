function $(w) {
    var tagName = w;
    var id = w.substr(1);
    return w.indexOf("#") == 0 ?  document.getElementById(id) : document.getElementsByTagName(tagName)[0];
    
}

var canvas = $("canvas");

function Arena() {
    var _ = 0;
    var P = 2;
    var w = 3;
    this.grid = [
        [w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w],
        [w,1,1,1,1,1,1,1,1,1,1,w,1,1,1,1,1,1,1,1,1,1,w],
        [w,1,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,P,w,_,w,1,w,_,_,w,1,w,1,w,_,_,w,1,w,_,w,P,w],
        [w,1,w,w,w,1,w,w,w,w,1,w,1,w,w,w,w,1,w,w,w,1,w],
        [w,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,w],
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
        [w,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,w],
        [w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w],
    ];
    this.width = this.grid[0].length;
    this.height = this.grid.length;
}

Arena.prototype.draw = function(canvas) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width / this.width;
    var h = canvas.height / this.height;
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    var dx=0;
    for (var x = 0; x < this.width; x++) {        
        var dy=0;
        for (var y = 0; y < this.height; y++) {
            switch (this.grid[y][x]) {
                case 1:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(dx + w/2, dy + h/2, w/8, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 2:
                    ctx.fillStyle = "#fff";
                    ctx.beginPath()
                    ctx.arc(dx + w/2, dy + h/2, w/4, 0, 2 * Math.PI)
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 3:
                    ctx.fillStyle = "#00f";
                    ctx.fillRect(dx, dy, w, h);
                    break;
            }
           dy+=h;
        }
        dx += w; 
    }
}

var map = new Arena();

canvas.style.width = map.width * 16 + "px";
canvas.style.height = map.height * 16 + "px";
canvas.style.border = "1px solid black";
canvas.style.backgroundColor = "black";

map.draw(canvas);

console.log("ok");