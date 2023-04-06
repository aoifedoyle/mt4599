/*
The following is the base code for the Normal Distribution Applet. 
*/
var can;
var ctx;
var h = 400;
var w = 496; //Divisible by 8.
var xorigin = 15;
var middle = (w + 2*xorigin)/2;

var mean = 100;
var sd = 15;

var rad = 6;
var base=10; //Size of triangle base.

var xvals = [];
var yvals = [];
var showz = false;

var ax = 100; 
var bx = 300;
var baseline = h+xorigin-50;
var dragp = 0;

var dragok = false;

var probab = 0;

var inputmean;
var inputsd;

var showFa = true; //show P(X<a)
var showFb = true;
	
window.onload = function(){
	can = document.getElementById("canvas");
	ctx = can.getContext("2d");			
	can.height = h+2*xorigin;
	can.width = w+2*xorigin;		
	can.addEventListener('mousedown', mouse_down);			
	can.addEventListener('mouseup', mouse_up);
	can.addEventListener('mouseout', mouse_up);
	
	
	for(var i=0; i < w; i++){
		xvals[i] = i;
		yvals[i] = jStat.normal.pdf(i,w/2,w/8);		
	}	
	paint();		
}

function paint(){	
	ctx.clearRect(0,0,can.width,can.height);
	ctx.fillStyle="black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	
	drawLine(ctx,xorigin,h+xorigin-50,w + 2*xorigin, h+xorigin-50);	//Draw x axis.	
		
	//Add numbers to x axis
	ctx.font="16px Arial";
	var unit = w/8;
	var txt = "";
	var val = 0;
	for(var i = 0; i <= 8; i++){
		ctx.fillStyle="black";
		val = eval(mean)+eval((i-4)*sd);
		txt = "" + val;
		ctx.fillText(txt, xorigin + i*unit - ctx.measureText(txt).width/2 , xorigin + h-30 );
		if(showz == true){
			ctx.fillStyle="black";
			txt = "" + i-4;
			ctx.fillText(txt, xorigin + i*unit - ctx.measureText(txt).width/2 , xorigin + h );
		}
	}	
	
	var axz = Math.round((ax-middle)/unit*100)/100; //zscore
	var bxz = Math.round((bx-middle)/unit*100)/100; //zscore
	
	var proba = Math.round((jStat.normal.cdf(axz, 0,1))*100)/100;	
	var probb = Math.round((jStat.normal.cdf(bxz, 0,1) )*100)/100;
	var probab = Math.round((probb-proba)*100)/100;
	
	var axval = Math.round((eval(axz*sd)+eval(mean))*100)/100; //context a
	var bxval = Math.round((eval(bxz*sd)+eval(mean))*100)/100;  //context b	

	//area between phiA and phiB
	ctx.fillStyle = "#00006699";
	ctx.fillRect(ax, 0, bx-ax, xorigin+h-50);
	
	if(showFa){
		drawTri(ctx, ax,"#0099cc", 2*base, base);
		txt = axval;
		ctx.fillText(txt, ax - ctx.measureText(txt).width/2, h+xorigin-15);
		ctx.fillStyle="white";
		ctx.font = ".7em Arial";
		txt="a";
		ctx.fillText(txt, ax - ctx.measureText(txt).width/2, h+xorigin-33);
	}
	if(showFb){
		ctx.font="16px Arial";
		drawTri(ctx, bx,"#0099cc", 2*base,base);
		txt = bxval;
		ctx.fillText(txt, bx - ctx.measureText(txt).width/2, h+xorigin-15);	
		ctx.fillStyle="white";
		ctx.font = ".7em Arial";
		txt="b";
		ctx.fillText(txt, bx - ctx.measureText(txt).width/2, h+xorigin-33);
	}
	
	drawCurve(ctx,xvals,yvals,false); //Draw the Normal Curve	
	
	/****ADD PROB TEXT****/	
	var sd2=Math.pow(sd,2);
	txt = "X ~ N(" + mean + ", " + sd2 + ")";
	document.getElementById("label1").innerHTML = txt;
	
	document.getElementById("problabel1").style.visibility = "visible";
	document.getElementById("problabel2").style.visibility = "hidden";
	document.getElementById("stdnlabel").style.visibility = "hidden";		
			
	txt = "P(" + axval + " <  X < " + bxval + ") = " + probab;
	document.getElementById("problabel1").innerHTML = txt;			
	
	if(showz){
		txt = "P(" + axz + " <  Z < " + bxz + ") = " + probab;
		document.getElementById("stdnlabel").style.visibility = "visible";
		document.getElementById("stdnlabel").innerHTML = txt;
	}
	
	
}

function drawTri(context, m, color, l, w){
	var ht = h + xorigin - 50 ;
	context.beginPath();
	context.moveTo(m, ht);
	context.lineTo(m+w, ht+l);
	context.lineTo(m-w, ht+l);
	context.lineTo(m, ht);
	context.closePath();
	context.fillStyle = color;
	context.fill();
}
function showZ(){
	if(showz) showz = false;
	else showz = true;
	paint();
}


function showA(){
	if(showFa) showFa = false;
	else showFa = true;
	paint();
}
function showB(){
	if(showFb) showFb = false;
	else showFb = true;
	paint();
}

function setMean() {
  var x = document.getElementById("myMean").value;
  mean = x;
  paint();
}
function setSD() {
  var x = document.getElementById("mySD").value;
  if(x > 0){ 
	sd = x;
	document.getElementById("label1").innerHTML = "";
  }
  else document.getElementById("label1").innerHTML = "The sd must be > 0.";
  paint();
}


function drawCurve(context, xvals, yvals, fill){
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.setLineDash([]);
    context.fillStyle = "white";
    context.beginPath();

	context.moveTo(w + 2*xorigin , xorigin + h-50); //bottom right
	for(var i = w; i >= 0; i--){
		context.lineTo(xorigin + xvals[i],xorigin + h-50-yvals[i]/yvals[middle]*350);
	}
    context.stroke();  //draw the curve
    context.lineTo(xorigin, 0); //top left
    context.lineTo(can.width,0); //top right
	context.moveTo(w + 2*xorigin , xorigin + h-50); //bottom right
    context.fill();
    context.closePath();
    context.fillStyle = "#000000"; // default back to none
}

function mouse_down(e){
	var rect = can.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;	
	
	if (x < ax + base  && x > ax - base  && y < baseline + 2*base &&  y > baseline - base ){
		dragok = true;
		dragp=0;
	}
	else if (x < bx + base  && x > bx - base  && y < baseline + 2*base &&  y > baseline - base){
		dragok = true;
		dragp=1;
	}
	else dragok=false;
	
	can.onmousemove = mouse_move;
}

function mouse_up(){
	dragok = false;	
	canvas.onmousemove = null;
}

function mouse_move(e){	
	var rect = can.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;	

	if (dragok && dragp == 0 && x < bx && x > xorigin) ax = x;
	else if (dragok && dragp == 1 && x > ax) bx = x;
		
	paint();
}

function drawLine(context, x1, y1, x2, y2){
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function drawpoint(context,x,y,color,r){
		context.fillStyle = color;	
		context.beginPath();
		context.arc(x, y, r, 0, 2*Math.PI);
		context.closePath();
		context.fill();
}
