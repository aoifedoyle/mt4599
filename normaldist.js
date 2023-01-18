var canvas;
var ctx;
var mean = 100;
var sd = 15;
var offsetB = 30;
var h = 400;
var w = 496;
var yorigin = h - offsetB;
var xorigin = 15;
var middle = (w + 2*xorigin)/2;
var baseline = h+xorigin-50
var xvals = [];
var yvals=[];
var lowerInput = 100
var upperInput = 300
var startx = 85;
var endx = 120;

window.onload = function(){
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
//var mean = document.getElementById("meanInput")
canvas.height = h+2*xorigin;
canvas.width = w+2*xorigin;
drawScatterplot();
//paint();
//updateSliders();
//drawPartialCurve();
}

//function to draw scatterplot
function drawScatterplot(){
    //Clearing the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Drawing x axis
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xorigin, yorigin);
    ctx.lineTo(w, yorigin);
    ctx.stroke();

    //Adding numbers to the x axis
    ctx.font = "14px Arial";
    var unit = w/8;
    var txt = "";
    var num = 0;
    var start = 0;
    var end = 0;
    for(var i = 0; i <= 8; i++){
        num = eval(mean) + eval((i-4)*sd);
        txt = "" + num;
        ctx.fillText(txt, xorigin + i*unit - (ctx.measureText(txt).width/2) , xorigin + yorigin)
        //ctx.fillText(txt, xorigin + i*unit - ctx.measureText(txt).width, xorigin + yorigin)
    }

    //Calculating y-values for the normal curve
    for (var i = 0; i < w; i++){
        xvals[i] = i;
        //yvals[i] = i * 1;
        //yvals[i] = jStat.normal.pdf(i, mean, sd) * 1000;
        yvals[i] = jStat.normal.pdf(i, w/2, w/8)*10000;
    }

    //Drawing the normal curve
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xorigin, yorigin - yvals[0]);
    for (var i = 1; i < xvals.length; i++) {
        ctx.lineTo(xorigin + xvals[i], yorigin - (yvals[i]/yvals[w/2]*(h*0.75)));
    }
    ctx.stroke();

    //partial curve
    start = Math.round((((startx - (mean - (4*sd)))/(8*sd)) * w));
    end = Math.round((((endx - (mean - (4*sd)))/(8*sd)) * w));

    ctx.strokeStyle= "black";
    ctx.fillStyle= "black";
    ctx.beginPath();
    ctx.moveTo(xorigin + xvals[start], yorigin);
    ctx.lineTo(xorigin + xvals[start], yorigin - (yvals[start]/yvals[w/2]*(h*0.75)));
    for(var i = start; i < end; i++){
        ctx.lineTo(xorigin + xvals[i], yorigin - (yvals[i]/yvals[w/2]*(h*0.75)));
    }
    ctx.lineTo(xorigin + xvals[end], yorigin);
    ctx.moveTo(xorigin + xvals[end], yorigin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

//Adding event listeners for user interactions 
document.getElementById("meanInput").addEventListener("input",
function(){
    mean = this.value;
    drawScatterplot();
});

document.getElementById("sdInput").addEventListener("input",
function(){
    sd = this.value;
    drawScatterplot();
});

lower = document.getElementById("lowerInput").addEventListener("input",
function(){
    startx = this.value;
    drawScatterplot();
    num = eval(mean) + eval((-4)*sd);
    this.min = num;
});
document.getElementById("upperInput").addEventListener("input",
function(){
    endx = this.value;
    drawScatterplot();
    num = eval(mean) + eval((4)*sd);
    this.max = num;
});