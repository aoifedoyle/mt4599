var canvas;
var crx;
var h = 400;
var w = 500;
var xorigin = 15;
var offsetB = 30;
var yorigin = h-offsetB;
var df1 = 15; //max value
var df2 = 20; //max value
var xMin = 0;
var xMax = 5;
var xScale = w/(xMax - xMin);
var yScale = h;

window.onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = h+2*xorigin;
    canvas.width = w+2*xorigin;

    //Draw x-axis
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, yorigin);
    ctx.lineTo(w, yorigin);
    ctx.stroke();

    //Draw the F-dist 
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (var x = xMin; x <= xMax; x += 0.1){
        var y = jStat.centralF.pdf(x, df1, df2);
        var xp = (x - xMin) * xScale;
        var yp = (1-y) * yScale - offsetB;
        if(x === xMin){
            ctx.moveTo(xp, yp);
        } else {
            ctx.lineTo(xp, yp);
        }
    }
    ctx.stroke();

    //Adding number to the x-axis
    ctx.font 
}
